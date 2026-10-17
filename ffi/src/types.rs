use bdk_wallet::bitcoin;
use bdk_wallet::chain::ChainPosition;
use bdk_wallet::KeychainKind as BdkKeychainKind;

// ═══════════════════════════════════════════════════════════════════════════════
//  ENUMS
// ═══════════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum Network {
    Bitcoin,
    Testnet,
    Signet,
    Regtest,
}

impl From<Network> for bitcoin::Network {
    fn from(n: Network) -> Self {
        match n {
            Network::Bitcoin => bitcoin::Network::Bitcoin,
            Network::Testnet => bitcoin::Network::Testnet,
            Network::Signet => bitcoin::Network::Signet,
            Network::Regtest => bitcoin::Network::Regtest,
        }
    }
}

impl From<bitcoin::Network> for Network {
    fn from(n: bitcoin::Network) -> Self {
        match n {
            bitcoin::Network::Bitcoin => Network::Bitcoin,
            bitcoin::Network::Testnet => Network::Testnet,
            bitcoin::Network::Signet => Network::Signet,
            bitcoin::Network::Regtest => Network::Regtest,
            _ => Network::Regtest, // fallback for unknown future variants
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum KeychainKind {
    External,
    Internal,
}

impl From<KeychainKind> for BdkKeychainKind {
    fn from(k: KeychainKind) -> Self {
        match k {
            KeychainKind::External => BdkKeychainKind::External,
            KeychainKind::Internal => BdkKeychainKind::Internal,
        }
    }
}

impl From<BdkKeychainKind> for KeychainKind {
    fn from(k: BdkKeychainKind) -> Self {
        match k {
            BdkKeychainKind::External => KeychainKind::External,
            BdkKeychainKind::Internal => KeychainKind::Internal,
        }
    }
}

/// Callback invoked on each item visited while syncing a wallet against a
/// chain source (Electrum/Esplora). Implemented on the JS side and passed to
/// the `sync_with_*` methods to drive a progress indicator.
///
/// Sync is bounded: `total` is the number of items (script pubkeys, txids and
/// outpoints) in the request, so `consumed as f64 / total as f64` is a usable
/// completion fraction. `inspect` is called from a background thread and should
/// return quickly — it must not block.
#[uniffi::export(with_foreign)]
pub trait SyncProgressInspector: Send + Sync {
    /// `consumed`: items processed so far. `total`: items in the whole request.
    fn inspect(&self, consumed: u64, total: u64);
}

/// Callback invoked on each script pubkey revealed while full-scanning a wallet
/// against a chain source (Electrum/Esplora). Implemented on the JS side and
/// passed to the `full_scan_with_*` methods.
///
/// Unlike sync, a full scan has no fixed total — it keeps revealing scripts per
/// keychain until `stop_gap` consecutive empty ones are seen — so only the
/// running count of scripts visited is reported, not a fraction. `inspect` is
/// called from a background thread and must not block.
#[uniffi::export(with_foreign)]
pub trait FullScanProgressInspector: Send + Sync {
    /// `keychain`/`index`: the spk just visited. `visited`: running count of
    /// scripts inspected so far across all keychains in this scan.
    fn inspect(&self, keychain: KeychainKind, index: u32, visited: u64);
}

/// Callback invoked while syncing a wallet against a Bitcoin Core node over RPC.
///
/// Unlike Electrum/Esplora — which reveal an open-ended set of scripts and have
/// no fixed total — an RPC sync walks blocks from a start height to the node's
/// chain tip, so progress has a *real* denominator: `current_height` vs
/// `tip_height`, giving a meaningful 0..1 completion fraction.
///
/// Calls are throttled (≈1000 over a full chain scan, regardless of range) so a
/// from-genesis rescan doesn't fire hundreds of thousands of FFI hops, and a
/// final call always lands exactly at the tip. `inspect` runs on a background
/// thread and must return quickly — it must not block.
#[uniffi::export(with_foreign)]
pub trait RpcSyncProgressInspector: Send + Sync {
    /// `current_height`: height of the block just applied.
    /// `tip_height`: the node's chain tip at the start of this sync.
    fn inspect(&self, current_height: u32, tip_height: u32);
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum ChangeSpendPolicy {
    ChangeAllowed,
    OnlyChange,
    ChangeForbidden,
}

impl From<ChangeSpendPolicy> for bdk_wallet::tx_builder::ChangeSpendPolicy {
    fn from(p: ChangeSpendPolicy) -> Self {
        match p {
            ChangeSpendPolicy::ChangeAllowed => Self::ChangeAllowed,
            ChangeSpendPolicy::OnlyChange => Self::OnlyChange,
            ChangeSpendPolicy::ChangeForbidden => Self::ChangeForbidden,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum TxOrdering {
    Shuffle,
    Untouched,
}

impl From<TxOrdering> for bdk_wallet::tx_builder::TxOrdering {
    fn from(o: TxOrdering) -> Self {
        match o {
            TxOrdering::Shuffle => Self::Shuffle,
            TxOrdering::Untouched => Self::Untouched,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum WordCount {
    Words12,
    Words15,
    Words18,
    Words21,
    Words24,
}

impl WordCount {
    /// Return the number of entropy bytes for this word count.
    pub fn entropy_bytes(&self) -> usize {
        match self {
            WordCount::Words12 => 16,
            WordCount::Words15 => 20,
            WordCount::Words18 => 24,
            WordCount::Words21 => 28,
            WordCount::Words24 => 32,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum Language {
    English,
    SimplifiedChinese,
    TraditionalChinese,
    Czech,
    French,
    Italian,
    Japanese,
    Korean,
    Portuguese,
    Spanish,
}

impl From<Language> for bip39::Language {
    fn from(l: Language) -> Self {
        match l {
            Language::English => Self::English,
            Language::SimplifiedChinese => Self::SimplifiedChinese,
            Language::TraditionalChinese => Self::TraditionalChinese,
            Language::Czech => Self::Czech,
            Language::French => Self::French,
            Language::Italian => Self::Italian,
            Language::Japanese => Self::Japanese,
            Language::Korean => Self::Korean,
            Language::Portuguese => Self::Portuguese,
            Language::Spanish => Self::Spanish,
        }
    }
}

impl From<bip39::Language> for Language {
    fn from(l: bip39::Language) -> Self {
        match l {
            bip39::Language::English => Language::English,
            bip39::Language::SimplifiedChinese => Language::SimplifiedChinese,
            bip39::Language::TraditionalChinese => Language::TraditionalChinese,
            bip39::Language::Czech => Language::Czech,
            bip39::Language::French => Language::French,
            bip39::Language::Italian => Language::Italian,
            bip39::Language::Japanese => Language::Japanese,
            bip39::Language::Korean => Language::Korean,
            bip39::Language::Portuguese => Language::Portuguese,
            bip39::Language::Spanish => Language::Spanish,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
pub enum DescriptorTemplate {
    BIP44,
    BIP49,
    BIP84,
    BIP86,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, uniffi::Enum)]
#[allow(non_camel_case_types)]
pub enum SingleKeyDescriptorTemplate {
    P2Pkh,
    P2Wpkh,
    P2Wpkh_P2Sh,
    P2TR,
}

/// How the Kyoto (BIP157/158) light client should scan filters on start-up.
#[derive(Debug, Clone, uniffi::Enum)]
pub enum KyotoScanType {
    /// Continue from the wallet's last known checkpoint. Use for an already-synced wallet.
    Sync,
    /// Rescan the chain to recover history. Use the first time a wallet is restored.
    Recovery {
        /// Highest derivation index known to have been used (lookahead during recovery).
        used_script_index: u32,
        /// Block height/hash at which to begin the rescan.
        start: KyotoRecoveryStart,
    },
    /// A brand-new wallet with no revealed scripts. Syncs block headers only
    /// (no filter downloads) from taproot activation on mainnet, or genesis on
    /// other networks. Later syncs on new blocks check filters as usual.
    NewWallet,
}

/// Where a Kyoto recovery scan should begin in the chain.
#[derive(Debug, Clone, uniffi::Enum)]
pub enum KyotoRecoveryStart {
    /// From the network's genesis block. Works on any network but is slow on mainnet.
    Genesis,
    /// One block before segwit activation (height 481,823). **Mainnet only.**
    SegwitActivation,
    /// One block before taproot activation (height 709,631). **Mainnet only.**
    TaprootActivation,
    /// From an explicit, trusted block height + hash. Works on any network.
    FromBlock { height: u32, block_hash: String },
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DICTIONARY STRUCTS (records)
// ═══════════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone, uniffi::Record)]
pub struct BlockId {
    pub height: u32,
    pub hash: String,
}

impl From<bdk_wallet::chain::BlockId> for BlockId {
    fn from(b: bdk_wallet::chain::BlockId) -> Self {
        Self {
            height: b.height,
            hash: b.hash.to_string(),
        }
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct OutPoint {
    pub txid: String,
    pub vout: u32,
}

impl OutPoint {
    pub fn to_bdk(&self) -> Result<bitcoin::OutPoint, crate::error::BdkError> {
        let txid: bitcoin::Txid = self
            .txid
            .parse()
            .map_err(|e| crate::error::BdkError::InvalidTransaction {
                message: format!("Invalid txid '{}': {}", self.txid, e),
            })?;
        Ok(bitcoin::OutPoint::new(txid, self.vout))
    }
}

impl From<bitcoin::OutPoint> for OutPoint {
    fn from(op: bitcoin::OutPoint) -> Self {
        Self {
            txid: op.txid.to_string(),
            vout: op.vout,
        }
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct TxOut {
    pub value: u64,
    pub script_pubkey_hex: String,
}

impl TxOut {
    pub fn to_bdk(&self) -> bitcoin::TxOut {
        use bitcoin::ScriptBuf;
        let script_bytes =
            hex::decode(&self.script_pubkey_hex).unwrap_or_default();
        bitcoin::TxOut {
            value: bitcoin::Amount::from_sat(self.value),
            script_pubkey: ScriptBuf::from_bytes(script_bytes),
        }
    }
}

impl From<&bitcoin::TxOut> for TxOut {
    fn from(txo: &bitcoin::TxOut) -> Self {
        Self {
            value: txo.value.to_sat(),
            script_pubkey_hex: hex::encode(txo.script_pubkey.as_bytes()),
        }
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct ConfirmationBlockTime {
    pub height: u32,
    pub block_hash: String,
    pub timestamp: u64,
}

impl From<bdk_wallet::chain::ConfirmationBlockTime> for ConfirmationBlockTime {
    fn from(c: bdk_wallet::chain::ConfirmationBlockTime) -> Self {
        Self {
            height: c.block_id.height,
            block_hash: c.block_id.hash.to_string(),
            timestamp: c.confirmation_time,
        }
    }
}

/// Extract ConfirmationBlockTime from a ChainPosition, returning None if unconfirmed.
pub fn chain_position_to_confirmation(
    cp: &ChainPosition<bdk_wallet::chain::ConfirmationBlockTime>,
) -> Option<ConfirmationBlockTime> {
    match cp {
        ChainPosition::Confirmed { anchor, .. } => Some((*anchor).into()),
        ChainPosition::Unconfirmed { .. } => None,
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct LocalOutput {
    pub outpoint: OutPoint,
    pub txout: TxOut,
    pub keychain: KeychainKind,
    pub is_spent: bool,
    pub derivation_index: u32,
    pub confirmation_block_time: Option<ConfirmationBlockTime>,
}

impl From<bdk_wallet::LocalOutput> for LocalOutput {
    fn from(lo: bdk_wallet::LocalOutput) -> Self {
        Self {
            outpoint: lo.outpoint.into(),
            txout: TxOut::from(&lo.txout),
            keychain: lo.keychain.into(),
            is_spent: lo.is_spent,
            derivation_index: lo.derivation_index,
            confirmation_block_time: chain_position_to_confirmation(&lo.chain_position),
        }
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct AddressInfo {
    pub index: u32,
    pub address: String,
    pub keychain: KeychainKind,
}

impl From<bdk_wallet::AddressInfo> for AddressInfo {
    fn from(ai: bdk_wallet::AddressInfo) -> Self {
        Self {
            index: ai.index,
            address: ai.address.to_string(),
            keychain: ai.keychain.into(),
        }
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct Balance {
    pub immature: u64,
    pub trusted_pending: u64,
    pub untrusted_pending: u64,
    pub confirmed: u64,
    pub trusted_spendable: u64,
    pub total: u64,
}

impl From<bdk_wallet::Balance> for Balance {
    fn from(b: bdk_wallet::Balance) -> Self {
        Self {
            immature: b.immature.to_sat(),
            trusted_pending: b.trusted_pending.to_sat(),
            untrusted_pending: b.untrusted_pending.to_sat(),
            confirmed: b.confirmed.to_sat(),
            trusted_spendable: b.trusted_spendable().to_sat(),
            total: b.total().to_sat(),
        }
    }
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct TxInput {
    pub previous_txid: String,
    pub previous_vout: u32,
    pub sequence: u32,
    pub script_sig_hex: String,
    pub witness: Vec<String>,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct TxOutput {
    pub value: u64,
    pub script_pubkey_hex: String,
    pub address: Option<String>,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct TxDetails {
    pub txid: String,
    pub sent: u64,
    pub received: u64,
    pub fee: Option<u64>,
    pub fee_rate: Option<f64>,
    pub balance_delta: i64,
    pub confirmation_block_time: Option<ConfirmationBlockTime>,
    pub version: i32,
    pub locktime: u32,
    pub inputs: Vec<TxInput>,
    pub outputs: Vec<TxOutput>,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct SentAndReceived {
    pub sent: u64,
    pub received: u64,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct Recipient {
    pub address: String,
    pub amount_sats: u64,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct DerivationInfo {
    pub keychain: KeychainKind,
    pub index: u32,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct KeychainInfo {
    pub keychain: KeychainKind,
    pub descriptor: String,
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SPENDING CONDITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/// Extra timelock requirements of a chosen spending path, applied to the
/// transaction by [`crate::TxBuilder::set_condition`].
///
/// Derive one from a policy path with [`crate::Wallet::policy_condition`], or
/// build it directly when the values are known (e.g. a fixed `older(144)`).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, uniffi::Record)]
pub struct Condition {
    /// Relative timelock (`older(n)`) as a consensus nSequence value.
    pub csv: Option<u32>,
    /// Absolute timelock (`after(n)`) as a consensus nLockTime value: a block
    /// height below 500,000,000, otherwise a UNIX timestamp.
    pub timelock: Option<u32>,
}

impl From<bdk_wallet::descriptor::Condition> for Condition {
    fn from(c: bdk_wallet::descriptor::Condition) -> Self {
        Self {
            csv: c.csv.map(|s| s.0),
            timelock: c.timelock.map(|l| l.to_consensus_u32()),
        }
    }
}

impl From<Condition> for bdk_wallet::descriptor::Condition {
    fn from(c: Condition) -> Self {
        Self {
            csv: c.csv.map(bitcoin::Sequence),
            timelock: c.timelock.map(bitcoin::absolute::LockTime::from_consensus),
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PSBT FINALIZATION OUTCOMES
// ═══════════════════════════════════════════════════════════════════════════════

/// Finalization status of a single PSBT input.
#[derive(Debug, Clone, PartialEq, Eq, uniffi::Enum)]
pub enum FinalizeInputOutcome {
    /// The input was already finalized before this call.
    AlreadyFinalized,
    /// The input was finalized during this call.
    Finalized,
    /// No descriptor (or spending plan) is known for the input, e.g. a foreign input.
    MissingDescriptor,
    /// The descriptor is known but the input could not be satisfied (missing
    /// signatures, unmet timelocks, …).
    CouldNotSatisfy { message: String },
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct FinalizeInputResult {
    pub input_index: u32,
    pub outcome: FinalizeInputOutcome,
}

/// Per-input result of a PSBT finalization attempt.
#[derive(Debug, Clone, uniffi::Record)]
pub struct FinalizePsbtOutcome {
    /// Whether every input is finalized after the call.
    pub is_finalized: bool,
    /// One entry per PSBT input, ordered by input index.
    pub inputs: Vec<FinalizeInputResult>,
}

impl From<bdk_wallet::FinalizeInputOutcome> for FinalizeInputOutcome {
    fn from(o: bdk_wallet::FinalizeInputOutcome) -> Self {
        use bdk_wallet::FinalizeInputOutcome as O;
        match o {
            O::AlreadyFinalized => Self::AlreadyFinalized,
            O::Finalized => Self::Finalized,
            O::MissingDescriptor => Self::MissingDescriptor,
            O::CouldNotSatisfy(e) => Self::CouldNotSatisfy {
                message: e.to_string(),
            },
        }
    }
}

impl From<bdk_wallet::FinalizePsbtOutcome> for FinalizePsbtOutcome {
    fn from(o: bdk_wallet::FinalizePsbtOutcome) -> Self {
        let is_finalized = o.is_finalized();
        let inputs = o
            .into_outcomes()
            .into_iter()
            .map(|(index, outcome)| FinalizeInputResult {
                input_index: index as u32,
                outcome: outcome.into(),
            })
            .collect();
        Self {
            is_finalized,
            inputs,
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UNSTABLE PSBT API (bdk-tx)
// ═══════════════════════════════════════════════════════════════════════════════

/// Coin selection strategy for [`crate::PsbtParams`].
#[derive(Debug, Clone, Copy, PartialEq, uniffi::Enum)]
pub enum SelectionStrategy {
    /// Single random draw (default).
    SingleRandomDraw,
    /// Branch-and-bound variant that minimizes fees while allowing change.
    LowestFee {
        /// Expected long-term fee rate (sat/vB) for spending the change output later.
        longterm_fee_rate: f64,
        /// How many BnB rounds to try before giving up.
        max_rounds: u32,
    },
    /// Spend every eligible coin (drain). With no recipients, requires a
    /// change address to sweep to.
    All,
}

/// Spending assets used to plan inputs: which keys will sign and which
/// timelocks the spend may rely on. Selects the spending path for complex
/// descriptors (the bdk-tx equivalent of a policy path).
#[derive(Debug, Clone, uniffi::Record)]
pub struct SpendAssets {
    /// Descriptor public keys that will sign, e.g. `[fingerprint/path]xpub…/0/*`
    /// or a hex public key. Empty means every key in the wallet's descriptors.
    pub keys: Vec<String>,
    /// Absolute timelock (`after(n)`, consensus nLockTime) the spend may use.
    pub after: Option<u32>,
    /// Relative timelock (`older(n)`, consensus nSequence) the spend may use.
    pub older: Option<u32>,
}

impl TxOrdering {
    pub(crate) fn to_bdk_generic<I, O>(self) -> bdk_wallet::tx_builder::TxOrdering<I, O> {
        match self {
            TxOrdering::Shuffle => bdk_wallet::tx_builder::TxOrdering::Shuffle,
            TxOrdering::Untouched => bdk_wallet::tx_builder::TxOrdering::Untouched,
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPER: hex encoding — thin wrapper over `bitcoin::hex` (hex-conservative).
// ═══════════════════════════════════════════════════════════════════════════════

pub(crate) mod hex {
    use bdk_wallet::bitcoin::hex::{DisplayHex, FromHex};

    #[inline]
    pub fn encode(bytes: &[u8]) -> String {
        bytes.to_lower_hex_string()
    }

    #[inline]
    pub fn decode(s: &str) -> Result<Vec<u8>, ()> {
        Vec::<u8>::from_hex(s).map_err(|_| ())
    }
}
