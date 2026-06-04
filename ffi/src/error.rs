use std::fmt;

#[derive(Debug, uniffi::Error)]
pub enum BdkError {
    // Wallet lifecycle
    InvalidDescriptor { message: String },
    WalletCreationFailed { message: String },
    WalletLoadFailed { message: String },
    WalletLoadMismatch { message: String },
    PersistError { message: String },

    // Address / script
    InvalidAddress { message: String },
    InvalidScript { message: String },

    // Transaction building
    TransactionBuildFailed { message: String },
    NoRecipients { message: String },
    NoUtxosSelected { message: String },
    OutputBelowDustLimit { message: String },
    InsufficientFunds { message: String },
    FeeRateTooLow { message: String },
    FeeTooLow { message: String },
    LockTimeConflict { message: String },
    RbfSequenceConflict { message: String },
    VersionZero { message: String },
    VersionOneCsv { message: String },
    SpendingPolicyRequired { message: String },
    MissingKeyOrigin { message: String },
    MissingNonWitnessUtxo { message: String },

    // UTXO management
    OutpointNotFound { message: String },

    // Fee bumping
    FeeBumpTargetNotFound { message: String },
    FeeBumpAlreadyConfirmed { message: String },
    FeeBumpIrreplaceable { message: String },
    FeeBumpFeeRateUnavailable { message: String },
    FeeBumpInvalidOutputIndex { message: String },

    // PSBT / signing
    InvalidPsbt { message: String },
    SignFailed { message: String },
    SignerMissingKey { message: String },
    SignerInvalidKey { message: String },
    SignerUserCanceled { message: String },
    SignerInputIndexOutOfRange { message: String },
    SignerMissingNonWitnessUtxo { message: String },
    SignerMissingWitnessUtxo { message: String },
    SignerMissingWitnessScript { message: String },
    SignerNonStandardSighash { message: String },
    SignerInvalidSighash { message: String },

    // Sync / broadcast
    SyncFailed { message: String },
    BroadcastFailed { message: String },

    // Transaction / PSBT parsing
    InvalidTransaction { message: String },
    TransactionNotFound { message: String },
    CannotConnect { message: String },
    CalculateFeeError { message: String },

    // Keys / mnemonic
    InvalidMnemonic { message: String },
    InvalidEntropy { message: String },
    KeyError { message: String },

    Generic { message: String },
}

impl fmt::Display for BdkError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidDescriptor { message } => write!(f, "Invalid descriptor: {message}"),
            Self::WalletCreationFailed { message } => write!(f, "Wallet creation failed: {message}"),
            Self::WalletLoadFailed { message } => write!(f, "Wallet load failed: {message}"),
            Self::WalletLoadMismatch { message } => write!(f, "Wallet load mismatch: {message}"),
            Self::PersistError { message } => write!(f, "Persistence error: {message}"),
            Self::InvalidAddress { message } => write!(f, "Invalid address: {message}"),
            Self::InvalidScript { message } => write!(f, "Invalid script: {message}"),
            Self::TransactionBuildFailed { message } => write!(f, "Transaction build failed: {message}"),
            Self::NoRecipients { message } => write!(f, "No recipients specified: {message}"),
            Self::NoUtxosSelected { message } => write!(f, "No UTXOs selected: {message}"),
            Self::OutputBelowDustLimit { message } => write!(f, "Output below dust limit: {message}"),
            Self::InsufficientFunds { message } => write!(f, "Insufficient funds: {message}"),
            Self::FeeRateTooLow { message } => write!(f, "Fee rate too low: {message}"),
            Self::FeeTooLow { message } => write!(f, "Fee too low: {message}"),
            Self::LockTimeConflict { message } => write!(f, "Lock time conflict: {message}"),
            Self::RbfSequenceConflict { message } => write!(f, "RBF sequence conflict: {message}"),
            Self::VersionZero { message } => write!(f, "Version 0 not allowed: {message}"),
            Self::VersionOneCsv { message } => write!(f, "Version 1 not compatible with CSV: {message}"),
            Self::SpendingPolicyRequired { message } => write!(f, "Spending policy required: {message}"),
            Self::MissingKeyOrigin { message } => write!(f, "Missing key origin: {message}"),
            Self::MissingNonWitnessUtxo { message } => write!(f, "Missing non-witness UTXO: {message}"),
            Self::OutpointNotFound { message } => write!(f, "Outpoint not found: {message}"),
            Self::FeeBumpTargetNotFound { message } => write!(f, "Fee bump target not found: {message}"),
            Self::FeeBumpAlreadyConfirmed { message } => write!(f, "Cannot fee bump confirmed tx: {message}"),
            Self::FeeBumpIrreplaceable { message } => write!(f, "Transaction not replaceable: {message}"),
            Self::FeeBumpFeeRateUnavailable { message } => write!(f, "Fee rate unavailable for fee bump: {message}"),
            Self::FeeBumpInvalidOutputIndex { message } => write!(f, "Invalid output index for fee bump: {message}"),
            Self::InvalidPsbt { message } => write!(f, "Invalid PSBT: {message}"),
            Self::SignFailed { message } => write!(f, "Signing failed: {message}"),
            Self::SignerMissingKey { message } => write!(f, "Signer missing key: {message}"),
            Self::SignerInvalidKey { message } => write!(f, "Signer invalid key: {message}"),
            Self::SignerUserCanceled { message } => write!(f, "Signing canceled by user: {message}"),
            Self::SignerInputIndexOutOfRange { message } => write!(f, "Signer input index out of range: {message}"),
            Self::SignerMissingNonWitnessUtxo { message } => write!(f, "Signer missing non-witness UTXO: {message}"),
            Self::SignerMissingWitnessUtxo { message } => write!(f, "Signer missing witness UTXO: {message}"),
            Self::SignerMissingWitnessScript { message } => write!(f, "Signer missing witness script: {message}"),
            Self::SignerNonStandardSighash { message } => write!(f, "Non-standard sighash type: {message}"),
            Self::SignerInvalidSighash { message } => write!(f, "Invalid sighash type: {message}"),
            Self::SyncFailed { message } => write!(f, "Sync failed: {message}"),
            Self::BroadcastFailed { message } => write!(f, "Broadcast failed: {message}"),
            Self::InvalidTransaction { message } => write!(f, "Invalid transaction: {message}"),
            Self::TransactionNotFound { message } => write!(f, "Transaction not found: {message}"),
            Self::CannotConnect { message } => write!(f, "Cannot connect chain update: {message}"),
            Self::CalculateFeeError { message } => write!(f, "Cannot calculate fee: {message}"),
            Self::InvalidMnemonic { message } => write!(f, "Invalid mnemonic: {message}"),
            Self::InvalidEntropy { message } => write!(f, "Invalid entropy: {message}"),
            Self::KeyError { message } => write!(f, "Key error: {message}"),
            Self::Generic { message } => write!(f, "Error: {message}"),
        }
    }
}

impl std::error::Error for BdkError {}

// ── From impls for upstream error types ──────────────────────────────────────

impl From<bdk_wallet::descriptor::DescriptorError> for BdkError {
    fn from(e: bdk_wallet::descriptor::DescriptorError) -> Self {
        Self::InvalidDescriptor { message: e.to_string() }
    }
}

impl From<bdk_wallet::error::CreateTxError> for BdkError {
    fn from(e: bdk_wallet::error::CreateTxError) -> Self {
        use bdk_wallet::error::CreateTxError::*;
        let msg = e.to_string();
        match e {
            Descriptor(_) => Self::InvalidDescriptor { message: msg },
            Policy(_) => Self::TransactionBuildFailed { message: msg },
            SpendingPolicyRequired(_) => Self::SpendingPolicyRequired { message: msg },
            Version0 => Self::VersionZero { message: msg },
            Version1Csv => Self::VersionOneCsv { message: msg },
            LockTime { .. } => Self::LockTimeConflict { message: msg },
            RbfSequenceCsv { .. } => Self::RbfSequenceConflict { message: msg },
            FeeTooLow { .. } => Self::FeeTooLow { message: msg },
            FeeRateTooLow { .. } => Self::FeeRateTooLow { message: msg },
            NoUtxosSelected => Self::NoUtxosSelected { message: msg },
            OutputBelowDustLimit(_) => Self::OutputBelowDustLimit { message: msg },
            CoinSelection(_) => Self::InsufficientFunds { message: msg },
            NoRecipients => Self::NoRecipients { message: msg },
            Psbt(_) => Self::InvalidPsbt { message: msg },
            MissingKeyOrigin(_) => Self::MissingKeyOrigin { message: msg },
            UnknownUtxo => Self::OutpointNotFound { message: msg },
            MissingNonWitnessUtxo(_) => Self::MissingNonWitnessUtxo { message: msg },
            MiniscriptPsbt(_) => Self::InvalidPsbt { message: msg },
        }
    }
}

impl From<bdk_wallet::error::BuildFeeBumpError> for BdkError {
    fn from(e: bdk_wallet::error::BuildFeeBumpError) -> Self {
        use bdk_wallet::error::BuildFeeBumpError::*;
        let msg = e.to_string();
        match e {
            UnknownUtxo(_) => Self::OutpointNotFound { message: msg },
            TransactionNotFound(_) => Self::FeeBumpTargetNotFound { message: msg },
            TransactionConfirmed(_) => Self::FeeBumpAlreadyConfirmed { message: msg },
            IrreplaceableTransaction(_) => Self::FeeBumpIrreplaceable { message: msg },
            FeeRateUnavailable => Self::FeeBumpFeeRateUnavailable { message: msg },
            InvalidOutputIndex(_) => Self::FeeBumpInvalidOutputIndex { message: msg },
        }
    }
}

impl From<bdk_wallet::signer::SignerError> for BdkError {
    fn from(e: bdk_wallet::signer::SignerError) -> Self {
        use bdk_wallet::signer::SignerError::*;
        let msg = e.to_string();
        match e {
            MissingKey => Self::SignerMissingKey { message: msg },
            InvalidKey => Self::SignerInvalidKey { message: msg },
            UserCanceled => Self::SignerUserCanceled { message: msg },
            InputIndexOutOfRange(_) => Self::SignerInputIndexOutOfRange { message: msg },
            MissingNonWitnessUtxo => Self::SignerMissingNonWitnessUtxo { message: msg },
            InvalidNonWitnessUtxo => Self::SignerMissingNonWitnessUtxo { message: msg },
            MissingWitnessUtxo => Self::SignerMissingWitnessUtxo { message: msg },
            MissingWitnessScript => Self::SignerMissingWitnessScript { message: msg },
            MissingHdKeypath => Self::SignerMissingKey { message: msg },
            NonStandardSighash => Self::SignerNonStandardSighash { message: msg },
            InvalidSighash => Self::SignerInvalidSighash { message: msg },
            SighashTaproot(_) => Self::SignerInvalidSighash { message: msg },
            MiniscriptPsbt(_) => Self::InvalidPsbt { message: msg },
            External(_) => Self::SignFailed { message: msg },
            Psbt(_) => Self::InvalidPsbt { message: msg },
        }
    }
}

impl From<bdk_wallet::chain::local_chain::CannotConnectError> for BdkError {
    fn from(e: bdk_wallet::chain::local_chain::CannotConnectError) -> Self {
        Self::CannotConnect { message: e.to_string() }
    }
}

impl From<bdk_wallet::LoadError> for BdkError {
    fn from(e: bdk_wallet::LoadError) -> Self {
        let msg = e.to_string();
        match e {
            bdk_wallet::LoadError::Mismatch(_) => Self::WalletLoadMismatch { message: msg },
            _ => Self::WalletLoadFailed { message: msg },
        }
    }
}

impl From<bdk_wallet::rusqlite::Error> for BdkError {
    fn from(e: bdk_wallet::rusqlite::Error) -> Self {
        Self::PersistError { message: e.to_string() }
    }
}

impl From<bdk_wallet::tx_builder::AddUtxoError> for BdkError {
    fn from(e: bdk_wallet::tx_builder::AddUtxoError) -> Self {
        Self::OutpointNotFound { message: e.to_string() }
    }
}

impl From<bdk_wallet::keys::KeyError> for BdkError {
    fn from(e: bdk_wallet::keys::KeyError) -> Self {
        Self::KeyError { message: e.to_string() }
    }
}

// ── Kyoto (BIP157/158 light client) ──────────────────────────────────────────
// `ClientError` is intentionally mapped at each call site instead of here, so a
// failed broadcast surfaces as `BroadcastFailed` while a failed sync stays `SyncFailed`.

impl From<bdk_kyoto::builder::BuilderError> for BdkError {
    fn from(e: bdk_kyoto::builder::BuilderError) -> Self {
        Self::SyncFailed { message: format!("Kyoto builder error: {e}") }
    }
}

impl From<bdk_kyoto::UpdateError> for BdkError {
    fn from(e: bdk_kyoto::UpdateError) -> Self {
        Self::SyncFailed { message: format!("Kyoto sync failed: {e}") }
    }
}

impl<E: std::fmt::Debug> From<bdk_wallet::CreateWithPersistError<E>> for BdkError {
    fn from(e: bdk_wallet::CreateWithPersistError<E>) -> Self {
        let msg = format!("{:?}", e);
        match e {
            bdk_wallet::CreateWithPersistError::Persist(_) => Self::PersistError { message: msg },
            bdk_wallet::CreateWithPersistError::Descriptor(_) => Self::InvalidDescriptor { message: msg },
            bdk_wallet::CreateWithPersistError::DataAlreadyExists(_) => Self::WalletCreationFailed { message: msg },
        }
    }
}

impl<E: std::fmt::Debug> From<bdk_wallet::LoadWithPersistError<E>> for BdkError {
    fn from(e: bdk_wallet::LoadWithPersistError<E>) -> Self {
        let msg = format!("{:?}", e);
        match e {
            bdk_wallet::LoadWithPersistError::Persist(_) => Self::PersistError { message: msg },
            bdk_wallet::LoadWithPersistError::InvalidChangeSet(load_err) => load_err.into(),
        }
    }
}
