use std::net::IpAddr;
use std::path::PathBuf;
use std::sync::Arc;

use bdk_kyoto::builder::{Builder, BuilderExt};
use bdk_kyoto::wallets::Single;
use bdk_kyoto::{HashCheckpoint, LightClient, Requester, ScanType, TrustedPeer, UpdateSubscriber};
use bdk_wallet::bitcoin::{self, BlockHash};
use tokio::sync::Mutex as AsyncMutex;

use crate::error::BdkError;
use crate::types::{KyotoRecoveryStart, KyotoScanType};
use crate::wallet::Wallet;

/// Callback implemented on the JS side to receive node log/warning events while
/// a [`KyotoClient`] is running. Methods are invoked from background threads and
/// should return quickly (e.g. forward to a UI log) — they must not block.
#[uniffi::export(with_foreign)]
pub trait KyotoNodeEventHandler: Send + Sync {
    /// Informational message (handshakes, progress, blocks received, …).
    fn on_info(&self, message: String);
    /// Warning message (peer timeouts, rejected txs, potential forks, …).
    fn on_warning(&self, message: String);
}

/// A running BIP157/158 compact-block-filter light client backed by Kyoto.
///
/// Unlike the Electrum/Esplora clients, this owns a long-lived peer-to-peer node
/// running on the global Tokio runtime. Construct it once, drive sync via
/// [`Wallet::sync_with_kyoto`], broadcast via [`Wallet::broadcast_with_kyoto`],
/// and call [`KyotoClient::shutdown`] (or simply drop it) when finished.
#[derive(uniffi::Object)]
pub struct KyotoClient {
    pub(crate) requester: Requester,
    // `update()` takes `&mut self` and is held across an `.await`, so it needs an
    // async-aware mutex rather than `std::sync::Mutex`.
    pub(crate) update_subscriber: AsyncMutex<UpdateSubscriber<Single>>,
}

#[uniffi::export]
impl KyotoClient {
    /// Build a light client for `wallet` and start its background node.
    ///
    /// - `scan_type`: [`KyotoScanType::Sync`] to continue from the wallet's
    ///   checkpoint, or [`KyotoScanType::Recovery`] to rescan for restoration.
    /// - `required_peers`: how many peers to maintain (clamped to >= 1).
    /// - `peers`: optional explicit peer IPs; empty falls back to DNS discovery.
    /// - `data_dir`: writable directory for header/peer persistence.
    /// - `handler`: receives info/warning events from the node.
    #[uniffi::constructor]
    pub fn new(
        wallet: Arc<Wallet>,
        scan_type: KyotoScanType,
        required_peers: u8,
        peers: Vec<String>,
        data_dir: String,
        handler: Arc<dyn KyotoNodeEventHandler>,
    ) -> Result<Self, BdkError> {
        let network = wallet.inner.lock().unwrap().network();
        let kyoto_scan = to_kyoto_scan_type(scan_type, network)?;

        let mut builder = Builder::new(network)
            .required_peers(required_peers.max(1))
            .data_dir(PathBuf::from(data_dir));
        for peer in &peers {
            let ip: IpAddr = peer.parse().map_err(|_| BdkError::SyncFailed {
                message: format!("Invalid peer IP address: '{peer}'"),
            })?;
            builder = builder.add_peer(TrustedPeer::from_ip(ip));
        }

        // `build_with_wallet` snapshots the wallet's scripts and checkpoint, so the
        // client is independent of the wallet after construction (no borrow held).
        let light_client: LightClient<_, Single> = {
            let w = wallet.inner.lock().unwrap();
            builder.build_with_wallet(&w, kyoto_scan)?
        };

        let (client, logging, update_subscriber) = light_client.subscribe();

        // Drain the info/warning channels into the foreign handler. Both tasks end
        // on their own when the node stops and drops the senders.
        let info_handler = handler.clone();
        let mut info_rx = logging.info_subscriber;
        crate::RUNTIME.spawn(async move {
            while let Some(info) = info_rx.recv().await {
                info_handler.on_info(info.to_string());
            }
        });
        let warn_handler = handler;
        let mut warn_rx = logging.warning_subscriber;
        crate::RUNTIME.spawn(async move {
            while let Some(warn) = warn_rx.recv().await {
                warn_handler.on_warning(warn.to_string());
            }
        });

        // `managed_start` hands us the node so we can drive it on our own runtime,
        // instead of `start()` which spawns on the ambient runtime (none exists in
        // the synchronous uniffi constructor thread and would panic).
        let (client, node) = client.managed_start();
        crate::RUNTIME.spawn(async move {
            let _ = node.run().await;
        });

        Ok(Self {
            requester: client.requester(),
            update_subscriber: AsyncMutex::new(update_subscriber),
        })
    }

    /// Whether the background node is still running.
    pub fn is_running(&self) -> bool {
        self.requester.is_running()
    }

    /// Stop the node and release peer connections. Idempotent-ish: returns an
    /// error if the node has already stopped.
    pub fn shutdown(&self) -> Result<(), BdkError> {
        self.requester.shutdown().map_err(|e| BdkError::SyncFailed {
            message: format!("Kyoto shutdown failed: {e}"),
        })
    }
}

impl Drop for KyotoClient {
    fn drop(&mut self) {
        // Best-effort: stop the background node when the client is dropped so we
        // don't leak a running P2P node. Errors (already-stopped) are ignored.
        let _ = self.requester.shutdown();
    }
}

fn to_kyoto_scan_type(
    scan: KyotoScanType,
    network: bitcoin::Network,
) -> Result<ScanType, BdkError> {
    match scan {
        KyotoScanType::Sync => Ok(ScanType::Sync),
        KyotoScanType::Recovery {
            used_script_index,
            start,
        } => Ok(ScanType::Recovery {
            used_script_index,
            checkpoint: to_checkpoint(start, network)?,
        }),
    }
}

fn to_checkpoint(
    start: KyotoRecoveryStart,
    network: bitcoin::Network,
) -> Result<HashCheckpoint, BdkError> {
    match start {
        KyotoRecoveryStart::Genesis => Ok(HashCheckpoint::from_genesis(network)),
        KyotoRecoveryStart::SegwitActivation => {
            require_mainnet(network, "SegwitActivation")?;
            Ok(HashCheckpoint::segwit_activation())
        }
        KyotoRecoveryStart::TaprootActivation => {
            require_mainnet(network, "TaprootActivation")?;
            Ok(HashCheckpoint::taproot_activation())
        }
        KyotoRecoveryStart::FromBlock { height, block_hash } => {
            let hash = block_hash
                .parse::<BlockHash>()
                .map_err(|e| BdkError::SyncFailed {
                    message: format!("Invalid recovery block hash '{block_hash}': {e}"),
                })?;
            Ok(HashCheckpoint::new(height, hash))
        }
    }
}

fn require_mainnet(network: bitcoin::Network, name: &str) -> Result<(), BdkError> {
    if network != bitcoin::Network::Bitcoin {
        return Err(BdkError::SyncFailed {
            message: format!(
                "{name} recovery checkpoint is only valid on mainnet; use Genesis or FromBlock on {network}"
            ),
        });
    }
    Ok(())
}
