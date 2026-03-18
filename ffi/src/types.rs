use bdk_wallet::bitcoin;
use bdk_wallet::chain::ChainPosition;
use bdk_wallet::KeychainKind as BdkKeychainKind;

// ═══════════════════════════════════════════════════════════════════════════════
//  ENUMS
// ═══════════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DescriptorTemplate {
    BIP44,
    BIP49,
    BIP84,
    BIP86,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[allow(non_camel_case_types)]
pub enum SingleKeyDescriptorTemplate {
    P2Pkh,
    P2Wpkh,
    P2Wpkh_P2Sh,
    P2TR,
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TAGGED UNION ENUM
// ═══════════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone)]
pub enum WalletEvent {
    ChainTipChanged {
        old_tip: BlockId,
        new_tip: BlockId,
    },
    TxConfirmed {
        txid: String,
        block_time: ConfirmationBlockTime,
    },
    TxUnconfirmed {
        txid: String,
    },
    TxReplaced {
        txid: String,
        conflicting_txids: Vec<String>,
    },
    TxDropped {
        txid: String,
    },
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DICTIONARY STRUCTS (records)
// ═══════════════════════════════════════════════════════════════════════════════

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
pub struct OutPoint {
    pub txid: String,
    pub vout: u32,
}

impl OutPoint {
    pub fn to_bdk(&self) -> Result<bitcoin::OutPoint, crate::error::BdkError> {
        let txid: bitcoin::Txid = self
            .txid
            .parse()
            .map_err(|_| crate::error::BdkError::InvalidTransaction)?;
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

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
pub struct TxDetails {
    pub txid: String,
    pub sent: u64,
    pub received: u64,
    pub fee: Option<u64>,
    pub fee_rate: Option<f64>,
    pub balance_delta: i64,
    pub confirmation_block_time: Option<ConfirmationBlockTime>,
    pub tx_hex: String,
}

#[derive(Debug, Clone)]
pub struct SentAndReceived {
    pub sent: u64,
    pub received: u64,
}

#[derive(Debug, Clone)]
pub struct Recipient {
    pub address: String,
    pub amount_sats: u64,
}

#[derive(Debug, Clone)]
pub struct DerivationInfo {
    pub keychain: KeychainKind,
    pub index: u32,
}

#[derive(Debug, Clone)]
pub struct KeychainInfo {
    pub keychain: KeychainKind,
    pub descriptor: String,
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPER: hex encoding (minimal, avoids extra dep)
// ═══════════════════════════════════════════════════════════════════════════════

pub(crate) mod hex {
    pub fn encode(bytes: &[u8]) -> String {
        bytes.iter().map(|b| format!("{:02x}", b)).collect()
    }

    pub fn decode(s: &str) -> Result<Vec<u8>, ()> {
        if s.len() % 2 != 0 {
            return Err(());
        }
        (0..s.len())
            .step_by(2)
            .map(|i| u8::from_str_radix(&s[i..i + 2], 16).map_err(|_| ()))
            .collect()
    }
}
