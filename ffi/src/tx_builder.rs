use std::sync::{Arc, Mutex};

use bdk_wallet::bitcoin::{self, Amount, FeeRate};

use crate::error::BdkError;
use crate::psbt::Psbt;
use crate::types::*;
use crate::wallet::Wallet;

/// Internal storage for TxBuilder parameters.
/// We accumulate params here and apply them in finish().
#[derive(Debug, Default)]
struct TxBuilderParams {
    recipients: Vec<(String, u64)>,
    fee_rate: Option<f64>,
    fee_absolute: Option<u64>,
    drain_wallet: bool,
    drain_to: Option<String>,
    manually_selected_only: bool,
    utxos: Vec<OutPoint>,
    unspendable: Vec<OutPoint>,
    change_policy: Option<ChangeSpendPolicy>,
    enable_rbf: bool,
    rbf_sequence: Option<u32>,
    exact_sequence: Option<u32>,
    ordering: Option<TxOrdering>,
    nlocktime: Option<u32>,
    version: Option<i32>,
    allow_dust: Option<bool>,
    current_height: Option<u32>,
    only_witness_utxo: bool,
    include_output_redeem_witness_script: bool,
    add_global_xpubs: bool,
    sighash: Option<u32>,
    policy_path: Vec<(String, KeychainKind)>,
    data: Vec<Vec<u8>>,
    exclude_below_confirmations: Option<u32>,
    exclude_unconfirmed: bool,
}

pub struct TxBuilder {
    params: Mutex<TxBuilderParams>,
}

impl TxBuilder {
    pub fn new() -> Self {
        Self {
            params: Mutex::new(TxBuilderParams::default()),
        }
    }

    pub fn add_recipient(&self, address: String, amount_sats: u64) {
        let mut p = self.params.lock().unwrap();
        p.recipients.push((address, amount_sats));
    }

    pub fn set_recipients(&self, recipients: Vec<Recipient>) {
        let mut p = self.params.lock().unwrap();
        p.recipients = recipients
            .into_iter()
            .map(|r| (r.address, r.amount_sats))
            .collect();
    }

    pub fn add_data(&self, data: Vec<u8>) {
        let mut p = self.params.lock().unwrap();
        p.data.push(data);
    }

    pub fn fee_rate(&self, sat_per_vbyte: f64) {
        let mut p = self.params.lock().unwrap();
        p.fee_rate = Some(sat_per_vbyte);
    }

    pub fn fee_absolute(&self, fee_sats: u64) {
        let mut p = self.params.lock().unwrap();
        p.fee_absolute = Some(fee_sats);
    }

    pub fn drain_wallet(&self) {
        let mut p = self.params.lock().unwrap();
        p.drain_wallet = true;
    }

    pub fn drain_to(&self, address: String) -> Result<(), BdkError> {
        // Validate address format (full validation happens in finish)
        let mut p = self.params.lock().unwrap();
        p.drain_to = Some(address);
        Ok(())
    }

    pub fn manually_selected_only(&self) {
        let mut p = self.params.lock().unwrap();
        p.manually_selected_only = true;
    }

    pub fn add_utxo(&self, outpoint: OutPoint) -> Result<(), BdkError> {
        let mut p = self.params.lock().unwrap();
        p.utxos.push(outpoint);
        Ok(())
    }

    pub fn add_utxos(&self, outpoints: Vec<OutPoint>) -> Result<(), BdkError> {
        let mut p = self.params.lock().unwrap();
        p.utxos.extend(outpoints);
        Ok(())
    }

    pub fn unspendable(&self, outpoints: Vec<OutPoint>) {
        let mut p = self.params.lock().unwrap();
        p.unspendable.extend(outpoints);
    }

    pub fn add_unspendable(&self, outpoint: OutPoint) {
        let mut p = self.params.lock().unwrap();
        p.unspendable.push(outpoint);
    }

    pub fn exclude_below_confirmations(&self, min_confirms: u32) {
        let mut p = self.params.lock().unwrap();
        p.exclude_below_confirmations = Some(min_confirms);
    }

    pub fn exclude_unconfirmed(&self) {
        let mut p = self.params.lock().unwrap();
        p.exclude_unconfirmed = true;
    }

    pub fn do_not_spend_change(&self) {
        let mut p = self.params.lock().unwrap();
        p.change_policy = Some(ChangeSpendPolicy::ChangeForbidden);
    }

    pub fn only_spend_change(&self) {
        let mut p = self.params.lock().unwrap();
        p.change_policy = Some(ChangeSpendPolicy::OnlyChange);
    }

    pub fn change_policy(&self, policy: ChangeSpendPolicy) {
        let mut p = self.params.lock().unwrap();
        p.change_policy = Some(policy);
    }

    pub fn enable_rbf(&self) {
        let mut p = self.params.lock().unwrap();
        p.enable_rbf = true;
    }

    pub fn enable_rbf_with_sequence(&self, nsequence: u32) {
        let mut p = self.params.lock().unwrap();
        p.enable_rbf = true;
        p.rbf_sequence = Some(nsequence);
    }

    pub fn set_exact_sequence(&self, nsequence: u32) {
        let mut p = self.params.lock().unwrap();
        p.exact_sequence = Some(nsequence);
    }

    pub fn ordering(&self, ordering: TxOrdering) {
        let mut p = self.params.lock().unwrap();
        p.ordering = Some(ordering);
    }

    pub fn nlocktime(&self, lock_height: u32) {
        let mut p = self.params.lock().unwrap();
        p.nlocktime = Some(lock_height);
    }

    pub fn tx_version(&self, version: i32) {
        let mut p = self.params.lock().unwrap();
        p.version = Some(version);
    }

    pub fn allow_dust(&self, allow: bool) {
        let mut p = self.params.lock().unwrap();
        p.allow_dust = Some(allow);
    }

    pub fn current_height(&self, height: u32) {
        let mut p = self.params.lock().unwrap();
        p.current_height = Some(height);
    }

    pub fn only_witness_utxo(&self) {
        let mut p = self.params.lock().unwrap();
        p.only_witness_utxo = true;
    }

    pub fn include_output_redeem_witness_script(&self) {
        let mut p = self.params.lock().unwrap();
        p.include_output_redeem_witness_script = true;
    }

    pub fn add_global_xpubs(&self) {
        let mut p = self.params.lock().unwrap();
        p.add_global_xpubs = true;
    }

    pub fn sighash(&self, sighash_type: u32) {
        let mut p = self.params.lock().unwrap();
        p.sighash = Some(sighash_type);
    }

    pub fn policy_path(&self, path_map_json: String, keychain: KeychainKind) {
        let mut p = self.params.lock().unwrap();
        p.policy_path.push((path_map_json, keychain));
    }

    /// Build the transaction into a PSBT using the wallet.
    pub fn finish(&self, wallet: Arc<Wallet>) -> Result<Arc<Psbt>, BdkError> {
        let params = self.params.lock().unwrap();
        let network = {
            let w = wallet.inner.lock().unwrap();
            w.network()
        };

        let mut w = wallet.inner.lock().unwrap();
        let mut builder = w.build_tx();

        // Recipients
        for (addr_str, amount) in &params.recipients {
            let addr = addr_str
                .parse::<bitcoin::Address<bitcoin::address::NetworkUnchecked>>()
                .map_err(|_| BdkError::InvalidAddress)?
                .require_network(network)
                .map_err(|_| BdkError::InvalidAddress)?;
            builder.add_recipient(addr.script_pubkey(), Amount::from_sat(*amount));
        }

        // Fee
        if let Some(rate) = params.fee_rate {
            let sat_per_kwu = (rate * 250.0) as u64;
            let fr = FeeRate::from_sat_per_kwu(sat_per_kwu);
            builder.fee_rate(fr);
        }
        if let Some(abs) = params.fee_absolute {
            builder.fee_absolute(Amount::from_sat(abs));
        }

        // Drain
        if params.drain_wallet {
            builder.drain_wallet();
        }
        if let Some(ref addr_str) = params.drain_to {
            let addr = addr_str
                .parse::<bitcoin::Address<bitcoin::address::NetworkUnchecked>>()
                .map_err(|_| BdkError::InvalidAddress)?
                .require_network(network)
                .map_err(|_| BdkError::InvalidAddress)?;
            builder.drain_to(addr.script_pubkey());
        }

        // UTXO selection
        if params.manually_selected_only {
            builder.manually_selected_only();
        }
        for utxo in &params.utxos {
            let op = utxo.to_bdk()?;
            builder.add_utxo(op)?;
        }
        let unspendable_ops: Vec<bitcoin::OutPoint> = params
            .unspendable
            .iter()
            .map(|u| u.to_bdk())
            .collect::<Result<Vec<_>, _>>()?;
        if !unspendable_ops.is_empty() {
            builder.unspendable(unspendable_ops);
        }
        if let Some(min) = params.exclude_below_confirmations {
            builder.exclude_below_confirmations(min);
        }
        if params.exclude_unconfirmed {
            builder.exclude_unconfirmed();
        }

        // Change policy
        if let Some(ref policy) = params.change_policy {
            builder.change_policy((*policy).into());
        }

        // RBF / sequence
        if let Some(seq) = params.exact_sequence {
            builder.set_exact_sequence(bitcoin::Sequence(seq));
        } else if params.enable_rbf {
            if let Some(seq) = params.rbf_sequence {
                builder.set_exact_sequence(bitcoin::Sequence(seq));
            } else {
                // Default RBF sequence: 0xFFFFFFFD
                builder.set_exact_sequence(bitcoin::Sequence(0xFFFFFFFD));
            }
        }

        // Ordering
        if let Some(ref ord) = params.ordering {
            builder.ordering((*ord).into());
        }

        // Lock time
        if let Some(h) = params.nlocktime {
            builder.nlocktime(bitcoin::absolute::LockTime::from_height(h)
                .map_err(|_| BdkError::LockTimeConflict)?);
        }

        // Version
        if let Some(v) = params.version {
            builder.version(v);
        }

        // Misc
        if let Some(allow) = params.allow_dust {
            builder.allow_dust(allow);
        }
        if let Some(h) = params.current_height {
            builder.current_height(h);
        }
        if params.only_witness_utxo {
            builder.only_witness_utxo();
        }
        if params.include_output_redeem_witness_script {
            builder.include_output_redeem_witness_script();
        }
        if params.add_global_xpubs {
            builder.add_global_xpubs();
        }

        // Data
        for data in &params.data {
            let push_bytes = bitcoin::script::PushBytesBuf::try_from(data.clone())
                .map_err(|_| BdkError::TransactionBuildFailed)?;
            builder.add_data(&push_bytes);
        }

        // Policy path
        for (json, keychain) in &params.policy_path {
            let path: std::collections::BTreeMap<String, Vec<usize>> =
                serde_json::from_str(json).map_err(|_| BdkError::TransactionBuildFailed)?;
            builder.policy_path(path, (*keychain).into());
        }

        let psbt = builder.finish()?;
        Ok(Arc::new(Psbt {
            inner: Mutex::new(psbt),
        }))
    }
}
