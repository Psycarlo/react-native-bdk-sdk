use std::ops::Deref;
use std::sync::{Arc, Mutex};

use bdk_wallet::bitcoin::{self, consensus, Amount, FeeRate, ScriptBuf, Transaction, Txid};
use bdk_wallet::rusqlite::Connection;
#[allow(deprecated)]
use bdk_wallet::SignOptions;
use bdk_wallet::PersistedWallet;

use crate::error::BdkError;
use crate::psbt::Psbt;
use crate::types::*;

pub struct Wallet {
    pub(crate) inner: Mutex<PersistedWallet<Connection>>,
    conn: Mutex<Connection>,
}

impl Wallet {
    /// Create or load a persisted wallet.
    pub fn new(
        descriptor: String,
        change_descriptor: String,
        network: Network,
        db_path: String,
    ) -> Result<Self, BdkError> {
        let net: bitcoin::Network = network.into();
        let mut conn = Connection::open(&db_path)?;

        // Try to load first
        let load_result = bdk_wallet::Wallet::load()
            .check_network(net)
            .load_wallet(&mut conn);

        let wallet = match load_result {
            Ok(Some(w)) => w,
            Ok(None) => {
                // No wallet found — create a new one
                bdk_wallet::Wallet::create(descriptor, change_descriptor)
                    .network(net)
                    .create_wallet(&mut conn)?
            }
            Err(e) => return Err(e.into()),
        };

        Ok(Self {
            inner: Mutex::new(wallet),
            conn: Mutex::new(conn),
        })
    }

    // ── Address management ────────────────────────────────────────────────────

    pub fn next_unused_address(&self, keychain: KeychainKind) -> Result<AddressInfo, BdkError> {
        let mut w = self.inner.lock().unwrap();
        let ai = w.next_unused_address(keychain.into());
        self.auto_persist(&mut w);
        Ok(ai.into())
    }

    pub fn reveal_next_address(&self, keychain: KeychainKind) -> Result<AddressInfo, BdkError> {
        let mut w = self.inner.lock().unwrap();
        let ai = w.reveal_next_address(keychain.into());
        self.auto_persist(&mut w);
        Ok(ai.into())
    }

    pub fn reveal_addresses_to(
        &self,
        keychain: KeychainKind,
        index: u32,
    ) -> Result<Vec<AddressInfo>, BdkError> {
        let mut w = self.inner.lock().unwrap();
        let addrs: Vec<AddressInfo> = w
            .reveal_addresses_to(keychain.into(), index)
            .map(|ai| ai.into())
            .collect();
        self.auto_persist(&mut w);
        Ok(addrs)
    }

    pub fn peek_address(&self, keychain: KeychainKind, index: u32) -> Result<AddressInfo, BdkError> {
        let w = self.inner.lock().unwrap();
        let ai = w.peek_address(keychain.into(), index);
        Ok(ai.into())
    }

    pub fn list_unused_addresses(
        &self,
        keychain: KeychainKind,
    ) -> Result<Vec<AddressInfo>, BdkError> {
        let w = self.inner.lock().unwrap();
        let addrs: Vec<AddressInfo> = w
            .list_unused_addresses(keychain.into())
            .map(|ai| ai.into())
            .collect();
        Ok(addrs)
    }

    pub fn mark_used(&self, keychain: KeychainKind, index: u32) -> bool {
        let mut w = self.inner.lock().unwrap();
        let changed = w.mark_used(keychain.into(), index);
        if changed {
            self.auto_persist(&mut w);
        }
        changed
    }

    pub fn unmark_used(&self, keychain: KeychainKind, index: u32) -> bool {
        let mut w = self.inner.lock().unwrap();
        let changed = w.unmark_used(keychain.into(), index);
        if changed {
            self.auto_persist(&mut w);
        }
        changed
    }

    // ── Balance ───────────────────────────────────────────────────────────────

    pub fn get_balance(&self) -> Result<Balance, BdkError> {
        let w = self.inner.lock().unwrap();
        Ok(w.balance().into())
    }

    // ── UTXOs ─────────────────────────────────────────────────────────────────

    pub fn list_unspent(&self) -> Result<Vec<LocalOutput>, BdkError> {
        let w = self.inner.lock().unwrap();
        Ok(w.list_unspent().map(|lo| lo.into()).collect())
    }

    pub fn list_output(&self) -> Result<Vec<LocalOutput>, BdkError> {
        let w = self.inner.lock().unwrap();
        Ok(w.list_output().map(|lo| lo.into()).collect())
    }

    pub fn get_utxo(&self, outpoint: OutPoint) -> Result<Option<LocalOutput>, BdkError> {
        let op = outpoint.to_bdk()?;
        let w = self.inner.lock().unwrap();
        Ok(w.get_utxo(op).map(|lo| lo.into()))
    }

    pub fn insert_txout(&self, outpoint: OutPoint, txout: TxOut) {
        let op = outpoint.to_bdk().unwrap();
        let bdk_txout = txout.to_bdk();
        let mut w = self.inner.lock().unwrap();
        w.insert_txout(op, bdk_txout);
        self.auto_persist(&mut w);
    }

    // ── Transactions ──────────────────────────────────────────────────────────

    pub fn transactions(&self) -> Result<Vec<TxDetails>, BdkError> {
        let w = self.inner.lock().unwrap();
        let mut details = Vec::new();
        for wallet_tx in w.transactions() {
            if let Some(td) = w.tx_details(wallet_tx.tx_node.txid) {
                details.push(self.convert_tx_details(&td));
            }
        }
        Ok(details)
    }

    pub fn tx_details(&self, txid: String) -> Result<Option<TxDetails>, BdkError> {
        let tid: Txid = txid.parse().map_err(|_| BdkError::InvalidTransaction)?;
        let w = self.inner.lock().unwrap();
        Ok(w.tx_details(tid).map(|td| self.convert_tx_details(&td)))
    }

    pub fn get_tx(&self, txid: String) -> Result<Option<String>, BdkError> {
        let tid: Txid = txid.parse().map_err(|_| BdkError::InvalidTransaction)?;
        let w = self.inner.lock().unwrap();
        Ok(w.get_tx(tid).map(|wtx| {
            let tx_bytes = consensus::encode::serialize(wtx.tx_node.tx.deref());
            hex::encode(&tx_bytes)
        }))
    }

    pub fn sent_and_received(&self, tx_hex: String) -> Result<SentAndReceived, BdkError> {
        let tx = self.decode_tx(&tx_hex)?;
        let w = self.inner.lock().unwrap();
        let (sent, received) = w.sent_and_received(&tx);
        Ok(SentAndReceived {
            sent: sent.to_sat(),
            received: received.to_sat(),
        })
    }

    pub fn calculate_fee(&self, tx_hex: String) -> Result<u64, BdkError> {
        let tx = self.decode_tx(&tx_hex)?;
        let w = self.inner.lock().unwrap();
        let fee = w.calculate_fee(&tx).map_err(|_| BdkError::CalculateFeeError)?;
        Ok(fee.to_sat())
    }

    pub fn calculate_fee_rate(&self, tx_hex: String) -> Result<f64, BdkError> {
        let tx = self.decode_tx(&tx_hex)?;
        let w = self.inner.lock().unwrap();
        let rate = w
            .calculate_fee_rate(&tx)
            .map_err(|_| BdkError::CalculateFeeError)?;
        Ok(rate.to_sat_per_vb_ceil() as f64)
    }

    pub fn cancel_tx(&self, tx_hex: String) -> Result<(), BdkError> {
        let tx = self.decode_tx(&tx_hex)?;
        let mut w = self.inner.lock().unwrap();
        w.cancel_tx(&tx);
        self.auto_persist(&mut w);
        Ok(())
    }

    // ── PSBT / Signing ────────────────────────────────────────────────────────

    #[allow(deprecated)]
    pub fn sign(&self, psbt: Arc<Psbt>) -> Result<bool, BdkError> {
        let w = self.inner.lock().unwrap();
        let mut psbt_inner = psbt.inner.lock().unwrap();
        let finalized = w.sign(&mut psbt_inner, SignOptions::default())?;
        Ok(finalized)
    }

    #[allow(deprecated)]
    pub fn finalize_psbt(&self, psbt: Arc<Psbt>) -> Result<bool, BdkError> {
        let w = self.inner.lock().unwrap();
        let mut psbt_inner = psbt.inner.lock().unwrap();
        let finalized = w.finalize_psbt(&mut psbt_inner, SignOptions::default())?;
        Ok(finalized)
    }

    // ── Sync ──────────────────────────────────────────────────────────────────

    pub fn full_scan_with_esplora(&self, url: String, stop_gap: u64) -> Result<(), BdkError> {
        use bdk_esplora::EsploraExt;

        let client = bdk_esplora::esplora_client::Builder::new(&url)
            .build_blocking();

        let mut w = self.inner.lock().unwrap();
        let request = w.start_full_scan().build();

        let update = client
            .full_scan(request, stop_gap as usize, 1)
            .map_err(|_| BdkError::SyncFailed)?;

        w.apply_update(update)?;
        self.persist_wallet(&mut w)?;
        Ok(())
    }

    pub fn sync_with_esplora(&self, url: String, _stop_gap: u64) -> Result<(), BdkError> {
        use bdk_esplora::EsploraExt;

        let client = bdk_esplora::esplora_client::Builder::new(&url)
            .build_blocking();

        let mut w = self.inner.lock().unwrap();
        let request = w.start_sync_with_revealed_spks().build();

        let update = client
            .sync(request, 1)
            .map_err(|_| BdkError::SyncFailed)?;

        w.apply_update(update)?;
        self.persist_wallet(&mut w)?;
        Ok(())
    }

    pub fn full_scan_with_electrum(&self, url: String, stop_gap: u64) -> Result<(), BdkError> {
        use bdk_electrum::BdkElectrumClient;

        let electrum_client = bdk_electrum::electrum_client::Client::new(&url)
            .map_err(|_| BdkError::SyncFailed)?;
        let client = BdkElectrumClient::new(electrum_client);

        let mut w = self.inner.lock().unwrap();
        let request = w.start_full_scan().build();

        let update = client
            .full_scan(request, stop_gap as usize, 1, false)
            .map_err(|_| BdkError::SyncFailed)?;

        w.apply_update(update)?;
        self.persist_wallet(&mut w)?;
        Ok(())
    }

    pub fn sync_with_electrum(&self, url: String, _stop_gap: u64) -> Result<(), BdkError> {
        use bdk_electrum::BdkElectrumClient;

        let electrum_client = bdk_electrum::electrum_client::Client::new(&url)
            .map_err(|_| BdkError::SyncFailed)?;
        let client = BdkElectrumClient::new(electrum_client);

        let mut w = self.inner.lock().unwrap();
        let request = w.start_sync_with_revealed_spks().build();

        let update = client
            .sync(request, 1, false)
            .map_err(|_| BdkError::SyncFailed)?;

        w.apply_update(update)?;
        self.persist_wallet(&mut w)?;
        Ok(())
    }

    // ── Broadcast ─────────────────────────────────────────────────────────────

    pub fn broadcast_with_esplora(&self, url: String, psbt: Arc<Psbt>) -> Result<String, BdkError> {
        let psbt_inner = psbt.inner.lock().unwrap();
        let tx = psbt_inner
            .clone()
            .extract_tx()
            .map_err(|_| BdkError::InvalidPsbt)?;

        let client = bdk_esplora::esplora_client::Builder::new(&url)
            .build_blocking();

        client
            .broadcast(&tx)
            .map_err(|_| BdkError::BroadcastFailed)?;

        Ok(tx.compute_txid().to_string())
    }

    pub fn broadcast_with_electrum(
        &self,
        url: String,
        psbt: Arc<Psbt>,
    ) -> Result<String, BdkError> {
        use bdk_electrum::electrum_client::ElectrumApi;

        let psbt_inner = psbt.inner.lock().unwrap();
        let tx = psbt_inner
            .clone()
            .extract_tx()
            .map_err(|_| BdkError::InvalidPsbt)?;

        let client = bdk_electrum::electrum_client::Client::new(&url)
            .map_err(|_| BdkError::BroadcastFailed)?;

        client
            .transaction_broadcast(&tx)
            .map_err(|_| BdkError::BroadcastFailed)?;

        Ok(tx.compute_txid().to_string())
    }

    // ── Convenience ───────────────────────────────────────────────────────────

    #[allow(deprecated)]
    pub fn send(
        &self,
        address: String,
        amount_sats: u64,
        fee_rate: f64,
        esplora_url: String,
    ) -> Result<String, BdkError> {
        let mut w = self.inner.lock().unwrap();
        let network = w.network();

        let addr = address
            .parse::<bitcoin::Address<bitcoin::address::NetworkUnchecked>>()
            .map_err(|_| BdkError::InvalidAddress)?
            .require_network(network)
            .map_err(|_| BdkError::InvalidAddress)?;

        let sat_per_kwu = (fee_rate * 250.0) as u64;
        let fr = FeeRate::from_sat_per_kwu(sat_per_kwu);

        let mut builder = w.build_tx();
        builder
            .add_recipient(addr.script_pubkey(), Amount::from_sat(amount_sats))
            .fee_rate(fr);

        let mut psbt = builder.finish()?;
        w.sign(&mut psbt, SignOptions::default())?;

        let tx = psbt.extract_tx().map_err(|_| BdkError::InvalidPsbt)?;

        let client = bdk_esplora::esplora_client::Builder::new(&esplora_url)
            .build_blocking();
        client.broadcast(&tx).map_err(|_| BdkError::BroadcastFailed)?;

        self.persist_wallet(&mut w)?;
        Ok(tx.compute_txid().to_string())
    }

    #[allow(deprecated)]
    pub fn drain(
        &self,
        address: String,
        fee_rate: f64,
        esplora_url: String,
    ) -> Result<String, BdkError> {
        let mut w = self.inner.lock().unwrap();
        let network = w.network();

        let addr = address
            .parse::<bitcoin::Address<bitcoin::address::NetworkUnchecked>>()
            .map_err(|_| BdkError::InvalidAddress)?
            .require_network(network)
            .map_err(|_| BdkError::InvalidAddress)?;

        let sat_per_kwu = (fee_rate * 250.0) as u64;
        let fr = FeeRate::from_sat_per_kwu(sat_per_kwu);

        let mut builder = w.build_tx();
        builder
            .drain_wallet()
            .drain_to(addr.script_pubkey())
            .fee_rate(fr);

        let mut psbt = builder.finish()?;
        w.sign(&mut psbt, SignOptions::default())?;

        let tx = psbt.extract_tx().map_err(|_| BdkError::InvalidPsbt)?;

        let client = bdk_esplora::esplora_client::Builder::new(&esplora_url)
            .build_blocking();
        client.broadcast(&tx).map_err(|_| BdkError::BroadcastFailed)?;

        self.persist_wallet(&mut w)?;
        Ok(tx.compute_txid().to_string())
    }

    // ── Fee bumping ───────────────────────────────────────────────────────────

    pub fn build_fee_bump(
        &self,
        txid: String,
        new_fee_rate: f64,
    ) -> Result<Arc<Psbt>, BdkError> {
        let tid: Txid = txid.parse().map_err(|_| BdkError::InvalidTransaction)?;
        let sat_per_kwu = (new_fee_rate * 250.0) as u64;
        let fr = FeeRate::from_sat_per_kwu(sat_per_kwu);

        let mut w = self.inner.lock().unwrap();
        let mut builder = w.build_fee_bump(tid)?;
        builder.fee_rate(fr);
        let psbt = builder.finish()?;

        Ok(Arc::new(Psbt {
            inner: Mutex::new(psbt),
        }))
    }

    // ── Script / SPK queries ──────────────────────────────────────────────────

    pub fn is_mine(&self, script_hex: String) -> bool {
        let bytes = hex::decode(&script_hex).unwrap_or_default();
        let script = ScriptBuf::from_bytes(bytes);
        let w = self.inner.lock().unwrap();
        w.is_mine(script)
    }

    pub fn derivation_of_spk(&self, script_hex: String) -> Option<DerivationInfo> {
        let bytes = hex::decode(&script_hex).unwrap_or_default();
        let script = ScriptBuf::from_bytes(bytes);
        let w = self.inner.lock().unwrap();
        w.derivation_of_spk(script).map(|(kc, idx)| DerivationInfo {
            keychain: kc.into(),
            index: idx,
        })
    }

    // ── Descriptor / keychain info ────────────────────────────────────────────

    pub fn public_descriptor(&self, keychain: KeychainKind) -> Result<String, BdkError> {
        let w = self.inner.lock().unwrap();
        Ok(w.public_descriptor(keychain.into()).to_string())
    }

    pub fn descriptor_checksum(&self, keychain: KeychainKind) -> Result<String, BdkError> {
        let w = self.inner.lock().unwrap();
        Ok(w.descriptor_checksum(keychain.into()))
    }

    pub fn keychains(&self) -> Vec<KeychainInfo> {
        let w = self.inner.lock().unwrap();
        w.keychains()
            .map(|(kc, desc)| KeychainInfo {
                keychain: kc.into(),
                descriptor: desc.to_string(),
            })
            .collect()
    }

    pub fn policies(&self, keychain: KeychainKind) -> Result<Option<String>, BdkError> {
        let w = self.inner.lock().unwrap();
        let policy = w
            .policies(keychain.into())
            .map_err(|_| BdkError::InvalidDescriptor)?;
        Ok(policy.map(|p| format!("{:?}", p)))
    }

    pub fn derivation_index(&self, keychain: KeychainKind) -> Option<u32> {
        let w = self.inner.lock().unwrap();
        w.derivation_index(keychain.into())
    }

    pub fn next_derivation_index(&self, keychain: KeychainKind) -> u32 {
        let w = self.inner.lock().unwrap();
        w.next_derivation_index(keychain.into())
    }

    // ── Chain state ───────────────────────────────────────────────────────────

    pub fn latest_checkpoint(&self) -> Option<BlockId> {
        let w = self.inner.lock().unwrap();
        let cp = w.latest_checkpoint();
        Some(BlockId {
            height: cp.height(),
            hash: cp.hash().to_string(),
        })
    }

    pub fn checkpoints(&self) -> Vec<BlockId> {
        let w = self.inner.lock().unwrap();
        w.checkpoints()
            .map(|cp| BlockId {
                height: cp.height(),
                hash: cp.hash().to_string(),
            })
            .collect()
    }

    // ── Persistence ───────────────────────────────────────────────────────────

    pub fn persist(&self) -> Result<bool, BdkError> {
        let mut w = self.inner.lock().unwrap();
        self.persist_wallet(&mut w)
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    pub fn network(&self) -> Network {
        let w = self.inner.lock().unwrap();
        w.network().into()
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    fn persist_wallet(
        &self,
        wallet: &mut PersistedWallet<Connection>,
    ) -> Result<bool, BdkError> {
        let mut conn = self.conn.lock().unwrap();
        wallet.persist(&mut *conn).map_err(|_| BdkError::PersistError)
    }

    fn auto_persist(&self, wallet: &mut PersistedWallet<Connection>) {
        let _ = self.persist_wallet(wallet);
    }

    fn decode_tx(&self, tx_hex: &str) -> Result<Transaction, BdkError> {
        let bytes = hex::decode(tx_hex).map_err(|_| BdkError::InvalidTransaction)?;
        consensus::encode::deserialize(&bytes).map_err(|_| BdkError::InvalidTransaction)
    }

    fn convert_tx_details(&self, td: &bdk_wallet::TxDetails) -> TxDetails {
        let tx_bytes = consensus::encode::serialize(td.tx.deref());
        TxDetails {
            txid: td.txid.to_string(),
            sent: td.sent.to_sat(),
            received: td.received.to_sat(),
            fee: td.fee.map(|f| f.to_sat()),
            fee_rate: td.fee_rate.map(|r| r.to_sat_per_vb_ceil() as f64),
            balance_delta: td.balance_delta.to_sat(),
            confirmation_block_time: chain_position_to_confirmation(&td.chain_position),
            tx_hex: hex::encode(&tx_bytes),
        }
    }
}
