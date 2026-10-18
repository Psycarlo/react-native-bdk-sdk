//! Experimental PSBT creation built on `bdk-tx` (`Wallet::create_psbt` /
//! `Wallet::replace_by_fee` in bdk_wallet 3.2).
//!
//! These APIs are gated behind bdk_wallet's `bdk-tx` feature and the
//! `bdk_wallet_unstable` cfg, and may change in any minor bdk_wallet release.

use std::collections::HashSet;
use std::str::FromStr;
use std::sync::{Arc, Mutex};

use bdk_wallet::bdk_tx::ChangeScript;
use bdk_wallet::bitcoin::{self, absolute, relative, Amount, FeeRate, ScriptBuf, Weight};
use bdk_wallet::chain::{CanonicalizationParams, ChainPosition};
use bdk_wallet::miniscript::descriptor::DescriptorPublicKey;
use bdk_wallet::miniscript::plan::Assets;

use crate::error::BdkError;
use crate::psbt::Psbt;
use crate::types::*;

/// Internal storage for PsbtParams. Values are validated when set and
/// applied to a `bdk_wallet::PsbtParams` in `create_psbt` / `replace_by_fee`.
#[derive(Debug, Default, Clone)]
struct PsbtParamsInner {
    utxos: Vec<bitcoin::OutPoint>,
    manually_selected_only: bool,
    recipients: Vec<(String, u64)>,
    data: Vec<Vec<u8>>,
    assets: Vec<SpendAssets>,
    locktime: Option<u32>,
    maturity_height: Option<u32>,
    anti_fee_sniping_height: Option<u32>,
    fee_rate: Option<f64>,
    coin_selection: Option<SelectionStrategy>,
    assume_canonical: Vec<bitcoin::Txid>,
    change_address: Option<String>,
    unspendable: Vec<bitcoin::OutPoint>,
    exclude_below_confirmations: Option<u32>,
    change_policy: Option<ChangeSpendPolicy>,
    ordering: Option<TxOrdering>,
    only_witness_utxo: bool,
    version: Option<i32>,
    add_global_xpubs: bool,
    sequence_overrides: Vec<(bitcoin::OutPoint, u32)>,
    fallback_sequence: Option<u32>,
}

/// **Experimental.** Parameters for [`crate::Wallet::create_psbt`] and
/// [`crate::Wallet::replace_by_fee`], backed by bdk_wallet's unstable
/// `bdk-tx` API. Unlike [`crate::TxBuilder`], spending paths are chosen with
/// [`PsbtParams::add_assets`] and the result comes with a [`Finalizer`].
#[derive(uniffi::Object)]
pub struct PsbtParams {
    inner: Mutex<PsbtParamsInner>,
}

#[uniffi::export]
impl PsbtParams {
    #[uniffi::constructor]
    pub fn new() -> Self {
        Self {
            inner: Mutex::new(PsbtParamsInner::default()),
        }
    }

    // ── Inputs ────────────────────────────────────────────────────────────────

    /// Must-spend a wallet UTXO. Ignored by `replace_by_fee`, which spends the
    /// inputs of the replaced transactions instead.
    pub fn add_utxo(&self, outpoint: OutPoint) -> Result<(), BdkError> {
        let op = outpoint.to_bdk()?;
        let mut p = self.inner.lock().unwrap();
        if !p.utxos.contains(&op) {
            p.utxos.push(op);
        }
        Ok(())
    }

    pub fn add_utxos(&self, outpoints: Vec<OutPoint>) -> Result<(), BdkError> {
        for op in outpoints {
            self.add_utxo(op)?;
        }
        Ok(())
    }

    pub fn remove_utxo(&self, outpoint: OutPoint) -> Result<(), BdkError> {
        let op = outpoint.to_bdk()?;
        let mut p = self.inner.lock().unwrap();
        p.utxos.retain(|u| *u != op);
        Ok(())
    }

    /// Only spend the UTXOs added with `add_utxo(s)`.
    pub fn manually_selected_only(&self) {
        self.inner.lock().unwrap().manually_selected_only = true;
    }

    /// Exclude UTXOs from coin selection.
    pub fn unspendable(&self, outpoints: Vec<OutPoint>) -> Result<(), BdkError> {
        let ops = outpoints
            .iter()
            .map(|o| o.to_bdk())
            .collect::<Result<Vec<_>, _>>()?;
        self.inner.lock().unwrap().unspendable.extend(ops);
        Ok(())
    }

    pub fn add_unspendable(&self, outpoint: OutPoint) -> Result<(), BdkError> {
        self.unspendable(vec![outpoint])
    }

    /// Exclude UTXOs with fewer than `min_confirms` confirmations from coin selection.
    pub fn exclude_below_confirmations(&self, min_confirms: u32) {
        self.inner.lock().unwrap().exclude_below_confirmations = Some(min_confirms);
    }

    /// Exclude unconfirmed UTXOs from coin selection.
    pub fn exclude_unconfirmed(&self) {
        self.exclude_below_confirmations(1);
    }

    /// Restrict coin selection by keychain (change vs. external outputs).
    pub fn change_policy(&self, policy: ChangeSpendPolicy) {
        self.inner.lock().unwrap().change_policy = Some(policy);
    }

    // ── Outputs ───────────────────────────────────────────────────────────────

    pub fn add_recipient(&self, address: String, amount_sats: u64) {
        self.inner.lock().unwrap().recipients.push((address, amount_sats));
    }

    pub fn add_recipients(&self, recipients: Vec<Recipient>) {
        let mut p = self.inner.lock().unwrap();
        p.recipients
            .extend(recipients.into_iter().map(|r| (r.address, r.amount_sats)));
    }

    /// Add an OP_RETURN output carrying `data`.
    pub fn add_data(&self, data: Vec<u8>) {
        self.inner.lock().unwrap().data.push(data);
    }

    /// Send change to this address instead of the wallet's next unused change
    /// address. Required for a sweep (`SelectionStrategy::All` with no recipients).
    pub fn change_address(&self, address: String) {
        self.inner.lock().unwrap().change_address = Some(address);
    }

    // ── Spending path / timelocks ─────────────────────────────────────────────

    /// Add spending assets (signing keys and usable timelocks). Without
    /// assets every wallet key is assumed able to sign. If only timelocks are
    /// given, the wallet's keys are used. Only the last `after`/`older` set
    /// across calls is kept.
    pub fn add_assets(&self, assets: SpendAssets) -> Result<(), BdkError> {
        // Validate eagerly so errors surface at the call site.
        spend_assets_to_bdk(&assets)?;
        self.inner.lock().unwrap().assets.push(assets);
        Ok(())
    }

    /// Minimum transaction nLockTime (consensus value: a height below
    /// 500,000,000, otherwise a UNIX timestamp). Raised by any `after()` the
    /// chosen spending path requires.
    pub fn locktime(&self, locktime: u32) {
        self.inner.lock().unwrap().locktime = Some(locktime);
    }

    /// Height used to evaluate coinbase maturity during coin selection.
    /// Defaults to the wallet tip.
    pub fn maturity_height(&self, height: u32) -> Result<(), BdkError> {
        to_height(height)?;
        self.inner.lock().unwrap().maturity_height = Some(height);
        Ok(())
    }

    /// Enable BIP-326 anti-fee-sniping using `tip_height` as the current height.
    pub fn anti_fee_sniping_height(&self, tip_height: u32) -> Result<(), BdkError> {
        to_height(tip_height)?;
        self.inner.lock().unwrap().anti_fee_sniping_height = Some(tip_height);
        Ok(())
    }

    // ── Fees / coin selection ─────────────────────────────────────────────────

    /// Target fee rate in sat/vB. Defaults to 1 sat/vB.
    pub fn fee_rate(&self, sat_per_vbyte: f64) {
        self.inner.lock().unwrap().fee_rate = Some(sat_per_vbyte);
    }

    pub fn coin_selection(&self, strategy: SelectionStrategy) {
        self.inner.lock().unwrap().coin_selection = Some(strategy);
    }

    /// Treat these transactions as canonical (winning any conflicts) while
    /// building this PSBT.
    pub fn assume_canonical(&self, txids: Vec<String>) -> Result<(), BdkError> {
        let parsed = txids
            .iter()
            .map(|t| parse_txid(t))
            .collect::<Result<Vec<_>, _>>()?;
        self.inner.lock().unwrap().assume_canonical.extend(parsed);
        Ok(())
    }

    // ── Layout ────────────────────────────────────────────────────────────────

    pub fn ordering(&self, ordering: TxOrdering) {
        self.inner.lock().unwrap().ordering = Some(ordering);
    }

    pub fn only_witness_utxo(&self) {
        self.inner.lock().unwrap().only_witness_utxo = true;
    }

    /// Transaction version. With version 3 (TRUC), coin selection only spends
    /// unconfirmed UTXOs from v3 parents, and vice versa (BIP-431 rule 2).
    /// Manually added UTXOs bypass this check.
    pub fn version(&self, version: i32) {
        self.inner.lock().unwrap().version = Some(version);
    }

    pub fn add_global_xpubs(&self) {
        self.inner.lock().unwrap().add_global_xpubs = true;
    }

    // ── Sequences ─────────────────────────────────────────────────────────────

    /// nSequence for a UTXO added with `add_utxo(s)`. Takes precedence over
    /// `fallback_sequence`.
    pub fn sequence_override(&self, outpoint: OutPoint, nsequence: u32) -> Result<(), BdkError> {
        let op = outpoint.to_bdk()?;
        let mut p = self.inner.lock().unwrap();
        p.sequence_overrides.retain(|(o, _)| *o != op);
        p.sequence_overrides.push((op, nsequence));
        Ok(())
    }

    /// nSequence for wallet inputs with no override and no CSV requirement.
    pub fn fallback_sequence(&self, nsequence: u32) {
        self.inner.lock().unwrap().fallback_sequence = Some(nsequence);
    }
}

impl PsbtParams {
    /// Build the bdk_wallet params against the wallet's current state.
    pub(crate) fn to_bdk(
        &self,
        wallet: &bdk_wallet::Wallet,
    ) -> Result<bdk_wallet::PsbtParams<bdk_wallet::CreateTx>, BdkError> {
        let p = self.inner.lock().unwrap().clone();
        let network = wallet.network();
        let mut params = bdk_wallet::PsbtParams::default();

        // Inputs
        if !p.utxos.is_empty() {
            params.add_utxos(&p.utxos);
        }
        if p.manually_selected_only {
            params.manually_selected_only();
        }

        // Outputs
        let mut recipients: Vec<(ScriptBuf, Amount)> = Vec::new();
        for (addr, amount) in &p.recipients {
            recipients.push((parse_address(addr, network)?, Amount::from_sat(*amount)));
        }
        for data in &p.data {
            let push = bitcoin::script::PushBytesBuf::try_from(data.clone()).map_err(|e| {
                BdkError::TransactionBuildFailed {
                    message: format!("OP_RETURN data too large: {}", e),
                }
            })?;
            recipients.push((ScriptBuf::new_op_return(&push), Amount::ZERO));
        }
        if !recipients.is_empty() {
            params.add_recipients(recipients);
        }
        if let Some(ref addr) = p.change_address {
            let spk = parse_address(addr, network)?;
            let change = match wallet.derivation_of_spk(spk.clone()) {
                Some((keychain, index)) => {
                    let descriptor = wallet
                        .public_descriptor(keychain)
                        .at_derivation_index(index)
                        .map_err(|e| BdkError::InvalidDescriptor {
                            message: format!("Cannot derive change descriptor: {}", e),
                        })?;
                    ChangeScript::from_descriptor(descriptor)
                }
                // Foreign script: spend weight unknown.
                None => ChangeScript::from_script(spk, Weight::ZERO),
            };
            params.change_script(change);
        }

        // Spending path / timelocks
        for assets in &p.assets {
            params.add_assets(spend_assets_to_bdk(assets)?);
        }
        if let Some(lt) = p.locktime {
            params.locktime(absolute::LockTime::from_consensus(lt));
        }
        if let Some(h) = p.maturity_height {
            params.maturity_height(to_height(h)?);
        }
        if let Some(h) = p.anti_fee_sniping_height {
            params.anti_fee_sniping_height(to_height(h)?);
        }

        // Fees / coin selection
        if let Some(rate) = p.fee_rate {
            params.fee_rate(to_fee_rate(rate));
        }
        if let Some(strategy) = p.coin_selection {
            params.coin_selection(match strategy {
                SelectionStrategy::SingleRandomDraw => bdk_wallet::SelectionStrategy::SingleRandomDraw,
                SelectionStrategy::LowestFee {
                    longterm_fee_rate,
                    max_rounds,
                } => bdk_wallet::SelectionStrategy::LowestFee {
                    longterm_feerate: to_fee_rate(longterm_fee_rate),
                    max_rounds: max_rounds as usize,
                },
                SelectionStrategy::All => bdk_wallet::SelectionStrategy::All,
            });
        }
        if !p.assume_canonical.is_empty() {
            params.canonicalization_params(CanonicalizationParams {
                assume_canonical: p.assume_canonical.clone(),
            });
        }

        // UTXO filters
        let unspendable: HashSet<bitcoin::OutPoint> = p.unspendable.iter().copied().collect();
        let min_confirms = p.exclude_below_confirmations.unwrap_or(0);
        let change_policy = p.change_policy.unwrap_or(ChangeSpendPolicy::ChangeAllowed);
        let tip = wallet.latest_checkpoint().height();
        let change_spks: HashSet<ScriptBuf> = if change_policy == ChangeSpendPolicy::ChangeAllowed {
            HashSet::new()
        } else {
            wallet
                .spk_index()
                .revealed_keychain_spks(bdk_wallet::KeychainKind::Internal)
                .map(|(_, spk)| spk)
                .collect()
        };
        // BIP-431 rule 2, as `TxBuilder` does: don't mix unconfirmed v3 (TRUC)
        // parents with other versions. bdk_wallet defaults to version 2.
        let truc = p.version == Some(3);
        let truc_txids: HashSet<bitcoin::Txid> = wallet
            .tx_graph()
            .full_txs()
            .filter(|tx| tx.tx.version == bitcoin::transaction::Version(3))
            .map(|tx| tx.txid)
            .collect();
        params.utxo_filter(move |txo| {
            if unspendable.contains(&txo.outpoint) {
                return false;
            }
            if !txo.chain_position.is_confirmed()
                && truc_txids.contains(&txo.outpoint.txid) != truc
            {
                return false;
            }
            if min_confirms > 0 {
                let confirms = match &txo.chain_position {
                    ChainPosition::Confirmed { anchor, .. } => {
                        tip.saturating_sub(anchor.block_id.height) + 1
                    }
                    ChainPosition::Unconfirmed { .. } => 0,
                };
                if confirms < min_confirms {
                    return false;
                }
            }
            let is_change = change_spks.contains(&txo.txout.script_pubkey);
            match change_policy {
                ChangeSpendPolicy::ChangeAllowed => true,
                ChangeSpendPolicy::OnlyChange => is_change,
                ChangeSpendPolicy::ChangeForbidden => !is_change,
            }
        });

        // Layout
        if let Some(ord) = p.ordering {
            params.ordering(ord.to_bdk_generic());
        }
        if p.only_witness_utxo {
            params.only_witness_utxo();
        }
        if let Some(v) = p.version {
            params.version(bitcoin::transaction::Version(v));
        }
        if p.add_global_xpubs {
            params.add_global_xpubs();
        }

        // Sequences
        for (op, seq) in &p.sequence_overrides {
            params.sequence_override(*op, bitcoin::Sequence(*seq));
        }
        if let Some(seq) = p.fallback_sequence {
            params.fallback_sequence(bitcoin::Sequence(seq));
        }

        Ok(params)
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FINALIZER
// ═══════════════════════════════════════════════════════════════════════════════

/// **Experimental.** Finalizes a PSBT returned by
/// [`crate::Wallet::create_psbt`] / [`crate::Wallet::replace_by_fee`] using
/// the spending plans computed while building it. Call after signing.
#[derive(uniffi::Object)]
pub struct Finalizer {
    inner: bdk_wallet::bdk_tx::Finalizer,
}

#[uniffi::export]
impl Finalizer {
    /// Finalize every signed input. Inputs that are already final are left
    /// untouched; inputs without a plan (foreign inputs) are reported as
    /// `MissingDescriptor`.
    pub fn finalize(&self, psbt: Arc<Psbt>) -> FinalizePsbtOutcome {
        let mut psbt_inner = psbt.inner.lock().unwrap();
        let results = self.inner.finalize(&mut psbt_inner).results();
        let inputs: Vec<FinalizeInputResult> = (0..psbt_inner.inputs.len())
            .map(|i| FinalizeInputResult {
                input_index: i as u32,
                outcome: match results.get(&i) {
                    // `finalize` skips inputs that were already final.
                    None => FinalizeInputOutcome::AlreadyFinalized,
                    Some(Ok(true)) => FinalizeInputOutcome::Finalized,
                    Some(Ok(false)) => FinalizeInputOutcome::MissingDescriptor,
                    Some(Err(e)) => FinalizeInputOutcome::CouldNotSatisfy {
                        message: e.to_string(),
                    },
                },
            })
            .collect();
        let is_finalized = inputs.iter().all(|r| {
            matches!(
                r.outcome,
                FinalizeInputOutcome::AlreadyFinalized | FinalizeInputOutcome::Finalized
            )
        });
        FinalizePsbtOutcome {
            is_finalized,
            inputs,
        }
    }
}

/// Result of [`crate::Wallet::create_psbt`] / [`crate::Wallet::replace_by_fee`].
#[derive(uniffi::Record)]
pub struct CreatePsbtResult {
    pub psbt: Arc<Psbt>,
    pub finalizer: Arc<Finalizer>,
}

impl CreatePsbtResult {
    pub(crate) fn new(psbt: bitcoin::Psbt, finalizer: bdk_wallet::bdk_tx::Finalizer) -> Self {
        Self {
            psbt: Arc::new(Psbt {
                inner: Mutex::new(psbt),
            }),
            finalizer: Arc::new(Finalizer { inner: finalizer }),
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

fn to_fee_rate(sat_per_vbyte: f64) -> FeeRate {
    FeeRate::from_sat_per_kwu((sat_per_vbyte * 250.0) as u64)
}

fn to_height(height: u32) -> Result<absolute::Height, BdkError> {
    absolute::Height::from_consensus(height).map_err(|e| BdkError::LockTimeConflict {
        message: format!("Invalid block height {}: {}", height, e),
    })
}

pub(crate) fn parse_txid(txid: &str) -> Result<bitcoin::Txid, BdkError> {
    txid.parse().map_err(|e| BdkError::InvalidTransaction {
        message: format!("Invalid txid '{}': {}", txid, e),
    })
}

fn parse_address(address: &str, network: bitcoin::Network) -> Result<ScriptBuf, BdkError> {
    Ok(address
        .parse::<bitcoin::Address<bitcoin::address::NetworkUnchecked>>()
        .map_err(|e| BdkError::InvalidAddress {
            message: format!("Cannot parse address '{}': {}", address, e),
        })?
        .require_network(network)
        .map_err(|e| BdkError::InvalidAddress {
            message: format!("Address '{}' not valid for network: {}", address, e),
        })?
        .script_pubkey())
}

fn spend_assets_to_bdk(assets: &SpendAssets) -> Result<Assets, BdkError> {
    let keys = assets
        .keys
        .iter()
        .map(|k| {
            DescriptorPublicKey::from_str(k).map_err(|e| BdkError::KeyError {
                message: format!("Invalid descriptor public key '{}': {}", k, e),
            })
        })
        .collect::<Result<Vec<_>, _>>()?;
    let mut out = Assets::new();
    if !keys.is_empty() {
        out = out.add(keys);
    }
    if let Some(after) = assets.after {
        out = out.after(absolute::LockTime::from_consensus(after));
    }
    if let Some(older) = assets.older {
        let lt = relative::LockTime::from_consensus(older).map_err(|e| {
            BdkError::LockTimeConflict {
                message: format!("Invalid relative timelock {}: {}", older, e),
            }
        })?;
        out = out.older(lt);
    }
    Ok(out)
}
