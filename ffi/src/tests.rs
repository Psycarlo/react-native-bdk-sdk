//! Offline tests for the bdk_wallet 3.2 APIs. In-crate so wallets can be
//! funded directly through the inner `bdk_wallet::Wallet`.

use std::sync::Arc;

use bdk_wallet::bitcoin::{
    self, absolute, block, hashes::Hash, transaction, Amount, Block, CompactTarget, TxIn,
    TxMerkleNode, TxOut,
};
use bdk_wallet::signer::SignersContainer;

use crate::*;

const XPRV: &str = "tprv8ZgxMBicQKsPd3EupYiPRhaMooHKUHJxNsTfYuScep13go8QFfHdtkG9nRkFGb7busX4isf6X9dURGCoKgitaApQ6MupRhZMcELAxTBRJgS";
const RECIPIENT: &str = "bcrt1q3qtze4ys45tgdvguj66zrk4fu6hq3a3v9pfly5";

fn external_desc() -> String {
    format!("wpkh({XPRV}/84'/1'/0'/0/*)")
}

fn internal_desc() -> String {
    format!("wpkh({XPRV}/84'/1'/0'/1/*)")
}

fn new_wallet() -> Arc<Wallet> {
    Arc::new(
        Wallet::new(
            external_desc(),
            Some(internal_desc()),
            Network::Regtest,
            ":memory:".into(),
        )
        .unwrap(),
    )
}

fn block_on<F: std::future::Future>(f: F) -> F::Output {
    crate::RUNTIME.block_on(f)
}

/// Confirm an output of `sats` to the wallet in a new block and return its outpoint.
/// `seed` keeps the dummy funding inputs distinct.
fn fund(wallet: &Wallet, sats: u64, seed: u8) -> bitcoin::OutPoint {
    let mut w = wallet.inner.lock().unwrap();
    let spk = w
        .reveal_next_address(bdk_wallet::KeychainKind::External)
        .script_pubkey();
    let tx = bitcoin::Transaction {
        version: transaction::Version::TWO,
        lock_time: absolute::LockTime::ZERO,
        input: vec![TxIn {
            previous_output: bitcoin::OutPoint::new(bitcoin::Txid::from_byte_array([seed; 32]), 0),
            ..Default::default()
        }],
        output: vec![TxOut {
            value: Amount::from_sat(sats),
            script_pubkey: spk,
        }],
    };
    let tip = w.latest_checkpoint().block_id();
    let block = Block {
        header: block::Header {
            version: block::Version::ONE,
            prev_blockhash: tip.hash,
            merkle_root: TxMerkleNode::all_zeros(),
            time: 0,
            bits: CompactTarget::from_consensus(0x207fffff),
            nonce: seed as u32,
        },
        txdata: vec![tx.clone()],
    };
    w.apply_block(&block, tip.height + 1).unwrap();
    bitcoin::OutPoint::new(tx.compute_txid(), 0)
}

fn ffi_outpoint(op: bitcoin::OutPoint) -> OutPoint {
    OutPoint {
        txid: op.txid.to_string(),
        vout: op.vout,
    }
}

/// Sign without finalizing, so finalization can be tested separately.
fn sign_only(wallet: &Wallet, psbt: &Psbt) {
    let w = wallet.inner.lock().unwrap();
    let secp = w.secp_ctx();
    let containers: Vec<SignersContainer> = [external_desc(), internal_desc()]
        .iter()
        .map(|d| {
            let (desc, keymap) =
                bdk_wallet::descriptor::Descriptor::parse_descriptor(secp, d).unwrap();
            SignersContainer::build(keymap, &desc, secp)
        })
        .collect();
    let refs: Vec<&SignersContainer> = containers.iter().collect();
    let opts = bdk_wallet::SignOptions {
        try_finalize: false,
        ..Default::default()
    };
    let finalized = w
        .sign_with_signers(&mut psbt.inner.lock().unwrap(), &refs, opts)
        .unwrap();
    assert!(!finalized);
}

fn send_params(amount: u64, fee_rate: f64) -> Arc<PsbtParams> {
    let params = Arc::new(PsbtParams::new());
    params.add_recipient(RECIPIENT.into(), amount);
    params.fee_rate(fee_rate);
    params
}

fn unsigned_tx(psbt: &Psbt) -> bitcoin::Transaction {
    psbt.inner.lock().unwrap().unsigned_tx.clone()
}

// ═══════════════════════════════════════════════════════════════════════════════
//  create_psbt / Finalizer
// ═══════════════════════════════════════════════════════════════════════════════

#[test]
fn create_psbt_sign_and_finalize() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);

    let res = block_on(wallet.clone().create_psbt(send_params(50_000, 2.0))).unwrap();

    // Unsigned inputs cannot be satisfied, and the PSBT is left untouched.
    let outcome = res.finalizer.finalize(res.psbt.clone());
    assert!(!outcome.is_finalized);
    assert_eq!(outcome.inputs.len(), 1);
    assert!(matches!(
        outcome.inputs[0].outcome,
        FinalizeInputOutcome::CouldNotSatisfy { .. }
    ));

    // Non-deprecated signing path, finalizes via the wallet.
    let finalized = wallet
        .sign_with_descriptors(res.psbt.clone(), vec![external_desc(), internal_desc()])
        .unwrap();
    assert!(finalized);

    let outcome = res.finalizer.finalize(res.psbt.clone());
    assert!(outcome.is_finalized);
    assert_eq!(
        outcome.inputs[0].outcome,
        FinalizeInputOutcome::AlreadyFinalized
    );

    let tx = res.psbt.extract_tx_hex().unwrap();
    assert!(!tx.is_empty());
    let unsigned = unsigned_tx(&res.psbt);
    assert!(unsigned.output.iter().any(|o| o.value.to_sat() == 50_000));
    // Change output → change address revealed and persisted.
    assert_eq!(unsigned.output.len(), 2);
    assert_eq!(wallet.derivation_index(KeychainKind::Internal), Some(0));
}

#[test]
fn finalizer_finalizes_signed_inputs() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);
    fund(&wallet, 100_000, 2);

    let res = block_on(wallet.clone().create_psbt(send_params(150_000, 1.0))).unwrap();
    sign_only(&wallet, &res.psbt);

    let outcome = res.finalizer.finalize(res.psbt.clone());
    assert!(outcome.is_finalized);
    assert_eq!(outcome.inputs.len(), 2);
    assert!(outcome
        .inputs
        .iter()
        .all(|i| i.outcome == FinalizeInputOutcome::Finalized));
    assert_eq!(
        outcome.inputs.iter().map(|i| i.input_index).collect::<Vec<_>>(),
        vec![0, 1]
    );
}

#[test]
fn create_psbt_no_recipients() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);
    let err = block_on(wallet.clone().create_psbt(Arc::new(PsbtParams::new()))).err();
    assert!(matches!(err, Some(BdkError::NoRecipients { .. })));
}

#[test]
fn create_psbt_insufficient_funds() {
    let wallet = new_wallet();
    fund(&wallet, 10_000, 1);
    let err = block_on(wallet.clone().create_psbt(send_params(50_000, 1.0))).err();
    assert!(matches!(err, Some(BdkError::InsufficientFunds { .. })));
}

#[test]
fn create_psbt_utxo_filters() {
    let wallet = new_wallet();
    let op = fund(&wallet, 100_000, 1);

    // Unspendable.
    let params = send_params(10_000, 1.0);
    params.add_unspendable(ffi_outpoint(op)).unwrap();
    assert!(block_on(wallet.clone().create_psbt(params)).is_err());

    // One confirmation at tip.
    let params = send_params(10_000, 1.0);
    params.exclude_below_confirmations(2);
    assert!(block_on(wallet.clone().create_psbt(params)).is_err());

    let params = send_params(10_000, 1.0);
    params.exclude_unconfirmed();
    assert!(block_on(wallet.clone().create_psbt(params)).is_ok());

    // Funds are on the external keychain.
    let params = send_params(10_000, 1.0);
    params.change_policy(ChangeSpendPolicy::OnlyChange);
    assert!(block_on(wallet.clone().create_psbt(params)).is_err());

    let params = send_params(10_000, 1.0);
    params.change_policy(ChangeSpendPolicy::ChangeForbidden);
    assert!(block_on(wallet.clone().create_psbt(params)).is_ok());
}

#[test]
fn create_psbt_sweep_to_change_address() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);
    fund(&wallet, 50_000, 2);

    let params = Arc::new(PsbtParams::new());
    params.coin_selection(SelectionStrategy::All);
    params.change_address(RECIPIENT.into());
    let res = block_on(wallet.clone().create_psbt(params)).unwrap();
    let tx = unsigned_tx(&res.psbt);
    assert_eq!(tx.input.len(), 2);
    assert_eq!(tx.output.len(), 1);
    let fee = res.psbt.fee_amount().unwrap();
    assert_eq!(tx.output[0].value.to_sat() + fee, 150_000);
}

#[test]
fn create_psbt_layout_options() {
    let wallet = new_wallet();
    let a = fund(&wallet, 100_000, 1);
    fund(&wallet, 100_000, 2);

    let params = send_params(20_000, 1.0);
    params.add_utxo(ffi_outpoint(a)).unwrap();
    params.manually_selected_only();
    params.sequence_override(ffi_outpoint(a), 0xFFFF_FFFD).unwrap();
    params.version(3);
    params.locktime(100);
    params.ordering(TxOrdering::Untouched);
    params.add_data(b"hello".to_vec());

    let res = block_on(wallet.clone().create_psbt(params)).unwrap();
    let tx = unsigned_tx(&res.psbt);
    assert_eq!(tx.input.len(), 1);
    assert_eq!(tx.input[0].previous_output, a);
    assert_eq!(tx.input[0].sequence.0, 0xFFFF_FFFD);
    assert_eq!(tx.version.0, 3);
    assert_eq!(tx.lock_time.to_consensus_u32(), 100);
    // Untouched: recipient, OP_RETURN, then change.
    assert_eq!(tx.output[0].value.to_sat(), 20_000);
    assert!(tx.output[1].script_pubkey.is_op_return());
}

#[test]
fn create_psbt_lowest_fee_and_assets() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);

    let params = send_params(30_000, 3.0);
    params.coin_selection(SelectionStrategy::LowestFee {
        longterm_fee_rate: 1.0,
        max_rounds: 10_000,
    });
    // Timelock-only assets fall back to the wallet's keys.
    params
        .add_assets(SpendAssets {
            keys: vec![],
            after: Some(1),
            older: None,
        })
        .unwrap();
    assert!(block_on(wallet.clone().create_psbt(params)).is_ok());

    let params = send_params(30_000, 1.0);
    let bad = params.add_assets(SpendAssets {
        keys: vec!["not a key".into()],
        after: None,
        older: None,
    });
    assert!(matches!(bad, Err(BdkError::KeyError { .. })));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  replace_by_fee
// ═══════════════════════════════════════════════════════════════════════════════

#[test]
fn replace_by_fee_bumps_fee() {
    let wallet = new_wallet();
    let funding = fund(&wallet, 100_000, 1);

    let original = block_on(wallet.clone().create_psbt(send_params(40_000, 2.0))).unwrap();
    wallet
        .sign_with_descriptors(original.psbt.clone(), vec![external_desc(), internal_desc()])
        .unwrap();
    let original_fee = original.psbt.fee_amount().unwrap();
    let tx = original.psbt.inner.lock().unwrap().clone().extract_tx().unwrap();
    let txid = tx.compute_txid();
    wallet
        .inner
        .lock()
        .unwrap()
        .apply_unconfirmed_txs([(tx, 1)]);

    let res = block_on(
        wallet
            .clone()
            .replace_by_fee(send_params(40_000, 10.0), vec![txid.to_string()]),
    )
    .unwrap();
    let replacement = unsigned_tx(&res.psbt);
    assert!(replacement.input.iter().any(|i| i.previous_output == funding));
    assert!(res.psbt.fee_amount().unwrap() > original_fee);

    // Unknown txid.
    let err = block_on(wallet.clone().replace_by_fee(
        send_params(40_000, 10.0),
        vec![bitcoin::Txid::from_byte_array([9; 32]).to_string()],
    ))
    .err();
    assert!(matches!(err, Some(BdkError::FeeBumpTargetNotFound { .. })));

    // Confirmed transaction.
    let err = block_on(
        wallet
            .clone()
            .replace_by_fee(send_params(40_000, 10.0), vec![funding.txid.to_string()]),
    )
    .err();
    assert!(err.is_some());
}

// ═══════════════════════════════════════════════════════════════════════════════
//  try_finalize_psbt / sign_with_descriptors
// ═══════════════════════════════════════════════════════════════════════════════

#[test]
fn try_finalize_psbt_outcomes() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);

    let builder = TxBuilder::new();
    builder.add_recipient(RECIPIENT.into(), 10_000);
    let psbt = block_on(builder.finish(wallet.clone())).unwrap();

    let outcome = wallet.try_finalize_psbt(psbt.clone()).unwrap();
    assert!(!outcome.is_finalized);
    assert!(matches!(
        outcome.inputs[0].outcome,
        FinalizeInputOutcome::CouldNotSatisfy { .. }
    ));

    sign_only(&wallet, &psbt);
    let outcome = wallet.try_finalize_psbt(psbt.clone()).unwrap();
    assert!(outcome.is_finalized);
    assert_eq!(outcome.inputs[0].outcome, FinalizeInputOutcome::Finalized);

    let outcome = wallet.try_finalize_psbt(psbt).unwrap();
    assert!(outcome.is_finalized);
    assert_eq!(
        outcome.inputs[0].outcome,
        FinalizeInputOutcome::AlreadyFinalized
    );
}

#[test]
fn sign_with_descriptors_errors_and_wrong_keys() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);
    let builder = TxBuilder::new();
    builder.add_recipient(RECIPIENT.into(), 10_000);
    let psbt = block_on(builder.finish(wallet.clone())).unwrap();

    let err = wallet.sign_with_descriptors(psbt.clone(), vec!["garbage".into()]);
    assert!(matches!(err, Err(BdkError::InvalidDescriptor { .. })));

    // Different account → no signature, not finalized.
    let other = format!("wpkh({XPRV}/84'/1'/1'/0/*)");
    assert!(!wallet.sign_with_descriptors(psbt, vec![other]).unwrap());
}

#[test]
fn sign_multipath_wallet_with_single_path_descriptors() {
    // Watch-only multipath wallet; miniscript can't parse multipath private keys,
    // so sign with one private descriptor per path.
    use bdk_wallet::bitcoin::bip32::{DerivationPath, Xpriv, Xpub};
    use std::str::FromStr;

    let secp = bitcoin::secp256k1::Secp256k1::new();
    let xprv = Xpriv::from_str(XPRV).unwrap();
    let path = DerivationPath::from_str("m/84'/1'/0'").unwrap();
    let xpub = Xpub::from_priv(&secp, &xprv.derive_priv(&secp, &path).unwrap());
    let fp = xprv.fingerprint(&secp);
    let desc = format!("wpkh([{fp}/84'/1'/0']{xpub}/<0;1>/*)");

    let wallet =
        Arc::new(Wallet::new_from_multipath(desc, Network::Regtest, ":memory:".into()).unwrap());
    fund(&wallet, 100_000, 1);

    let res = block_on(wallet.clone().create_psbt(send_params(10_000, 1.0))).unwrap();
    assert!(wallet
        .sign_with_descriptors(res.psbt.clone(), vec![external_desc(), internal_desc()])
        .unwrap());
    assert!(res.psbt.extract_tx_hex().is_ok());
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Conditions
// ═══════════════════════════════════════════════════════════════════════════════

const KEY_A: &str = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
const KEY_B: &str = "02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5";
const KEY_C: &str = "02f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9";

#[test]
fn spending_policy_and_policy_condition() {
    let wallet = Wallet::new(
        format!("wsh(or_d(pk({KEY_A}),and_v(v:pk({KEY_B}),older(144))))"),
        Some(format!("wsh(or_d(pk({KEY_C}),and_v(v:pk({KEY_B}),older(144))))")),
        Network::Regtest,
        ":memory:".into(),
    )
    .unwrap();

    let json = wallet
        .spending_policy(KeychainKind::External)
        .unwrap()
        .expect("policy");
    let policy: serde_json::Value = serde_json::from_str(&json).unwrap();
    let id = policy["id"].as_str().unwrap();

    let timelocked = wallet
        .policy_condition(format!(r#"{{"{id}":[1]}}"#), KeychainKind::External)
        .unwrap();
    assert_eq!(
        timelocked,
        Condition {
            csv: Some(144),
            timelock: None
        }
    );

    let key_path = wallet
        .policy_condition(format!(r#"{{"{id}":[0]}}"#), KeychainKind::External)
        .unwrap();
    assert_eq!(key_path, Condition::default());

    // Path required for this descriptor.
    assert!(wallet
        .policy_condition("{}".into(), KeychainKind::External)
        .is_err());
    assert!(wallet
        .policy_condition("not json".into(), KeychainKind::External)
        .is_err());
}

#[test]
fn single_key_policy_condition_is_empty() {
    let wallet = new_wallet();
    assert_eq!(
        wallet
            .policy_condition("{}".into(), KeychainKind::External)
            .unwrap(),
        Condition::default()
    );
    // Deprecated API unchanged.
    assert!(wallet.policies(KeychainKind::External).is_ok());
}

#[test]
fn tx_builder_set_condition() {
    let wallet = new_wallet();
    fund(&wallet, 100_000, 1);

    let builder = TxBuilder::new();
    builder.add_recipient(RECIPIENT.into(), 10_000);
    builder.set_condition(Condition {
        csv: Some(6),
        timelock: Some(50),
    });
    let psbt = block_on(builder.finish(wallet.clone())).unwrap();
    let tx = unsigned_tx(&psbt);
    assert_eq!(tx.lock_time.to_consensus_u32(), 50);
    assert!(tx.input.iter().all(|i| i.sequence.0 == 6));
}
