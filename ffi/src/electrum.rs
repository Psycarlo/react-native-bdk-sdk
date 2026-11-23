use std::sync::Mutex;

use bdk_electrum::BdkElectrumClient;

use crate::error::BdkError;

/// Scripts per Electrum batch request when none is given.
pub const DEFAULT_ELECTRUM_BATCH_SIZE: u64 = 1;

/// A reusable Electrum client that holds a persistent TCP/TLS connection.
/// Create once, pass to multiple wallet methods to avoid reconnecting each time.
#[derive(uniffi::Object)]
pub struct ElectrumClient {
    pub(crate) inner: Mutex<BdkElectrumClient<bdk_electrum::electrum_client::Client>>,
    pub(crate) batch_size: usize,
}

#[uniffi::export]
impl ElectrumClient {
    /// Connect to an Electrum server.
    /// url: e.g. "ssl://electrum.blockstream.info:60002" or "tcp://localhost:50001"
    #[uniffi::constructor]
    pub fn new(url: String) -> Result<Self, BdkError> {
        Self::with_options(url, DEFAULT_ELECTRUM_BATCH_SIZE)
    }

    /// Connect to an Electrum server, sending up to `batch_size` scripts per
    /// request in syncs and full scans. Larger batches cut round trips, which
    /// matters most on high-latency links such as Tor.
    #[uniffi::constructor]
    pub fn with_options(url: String, batch_size: u64) -> Result<Self, BdkError> {
        if batch_size == 0 {
            return Err(BdkError::Generic {
                message: "Electrum batch size must be at least 1".into(),
            });
        }
        let raw = bdk_electrum::electrum_client::Client::new(&url)
            .map_err(|e| BdkError::SyncFailed {
                message: format!("Failed to connect to Electrum server '{}': {}", url, e),
            })?;
        Ok(Self {
            inner: Mutex::new(BdkElectrumClient::new(raw)),
            batch_size: batch_size as usize,
        })
    }
}
