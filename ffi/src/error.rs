use std::fmt;

#[derive(Debug)]
pub enum BdkError {
    // Wallet lifecycle
    InvalidDescriptor,
    WalletCreationFailed,
    WalletLoadFailed,
    WalletLoadMismatch,
    PersistError,

    // Address / script
    InvalidAddress,
    InvalidScript,

    // Transaction building
    TransactionBuildFailed,
    NoRecipients,
    NoUtxosSelected,
    OutputBelowDustLimit,
    InsufficientFunds,
    FeeRateTooLow,
    FeeTooLow,
    LockTimeConflict,
    RbfSequenceConflict,
    VersionZero,
    VersionOneCsv,
    SpendingPolicyRequired,
    MissingKeyOrigin,
    MissingNonWitnessUtxo,

    // UTXO management
    OutpointNotFound,

    // Fee bumping
    FeeBumpTargetNotFound,
    FeeBumpAlreadyConfirmed,
    FeeBumpIrreplaceable,
    FeeBumpFeeRateUnavailable,
    FeeBumpInvalidOutputIndex,

    // PSBT / signing
    InvalidPsbt,
    SignFailed,
    SignerMissingKey,
    SignerInvalidKey,
    SignerUserCanceled,
    SignerInputIndexOutOfRange,
    SignerMissingNonWitnessUtxo,
    SignerMissingWitnessUtxo,
    SignerMissingWitnessScript,
    SignerNonStandardSighash,
    SignerInvalidSighash,

    // Sync / broadcast
    SyncFailed,
    BroadcastFailed,

    // Transaction / PSBT parsing
    InvalidTransaction,
    TransactionNotFound,
    CannotConnect,
    CalculateFeeError,

    // Keys / mnemonic
    InvalidMnemonic,
    InvalidEntropy,
    KeyError,

    Generic,
}

impl fmt::Display for BdkError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidDescriptor => write!(f, "Invalid descriptor"),
            Self::WalletCreationFailed => write!(f, "Wallet creation failed"),
            Self::WalletLoadFailed => write!(f, "Wallet load failed"),
            Self::WalletLoadMismatch => write!(f, "Wallet load mismatch"),
            Self::PersistError => write!(f, "Persistence error"),
            Self::InvalidAddress => write!(f, "Invalid address"),
            Self::InvalidScript => write!(f, "Invalid script"),
            Self::TransactionBuildFailed => write!(f, "Transaction build failed"),
            Self::NoRecipients => write!(f, "No recipients specified"),
            Self::NoUtxosSelected => write!(f, "No UTXOs selected"),
            Self::OutputBelowDustLimit => write!(f, "Output below dust limit"),
            Self::InsufficientFunds => write!(f, "Insufficient funds"),
            Self::FeeRateTooLow => write!(f, "Fee rate too low"),
            Self::FeeTooLow => write!(f, "Fee too low"),
            Self::LockTimeConflict => write!(f, "Lock time conflict"),
            Self::RbfSequenceConflict => write!(f, "RBF sequence conflict with CSV"),
            Self::VersionZero => write!(f, "Transaction version 0 not allowed"),
            Self::VersionOneCsv => write!(f, "Transaction version 1 not compatible with CSV"),
            Self::SpendingPolicyRequired => write!(f, "Spending policy required"),
            Self::MissingKeyOrigin => write!(f, "Missing key origin"),
            Self::MissingNonWitnessUtxo => write!(f, "Missing non-witness UTXO"),
            Self::OutpointNotFound => write!(f, "Outpoint not found"),
            Self::FeeBumpTargetNotFound => write!(f, "Fee bump target transaction not found"),
            Self::FeeBumpAlreadyConfirmed => write!(f, "Cannot fee bump already confirmed tx"),
            Self::FeeBumpIrreplaceable => write!(f, "Transaction is not replaceable (RBF)"),
            Self::FeeBumpFeeRateUnavailable => write!(f, "Fee rate unavailable for fee bump"),
            Self::FeeBumpInvalidOutputIndex => write!(f, "Invalid output index for fee bump"),
            Self::InvalidPsbt => write!(f, "Invalid PSBT"),
            Self::SignFailed => write!(f, "Signing failed"),
            Self::SignerMissingKey => write!(f, "Signer missing key"),
            Self::SignerInvalidKey => write!(f, "Signer invalid key"),
            Self::SignerUserCanceled => write!(f, "Signing canceled by user"),
            Self::SignerInputIndexOutOfRange => write!(f, "Signer input index out of range"),
            Self::SignerMissingNonWitnessUtxo => write!(f, "Signer missing non-witness UTXO"),
            Self::SignerMissingWitnessUtxo => write!(f, "Signer missing witness UTXO"),
            Self::SignerMissingWitnessScript => write!(f, "Signer missing witness script"),
            Self::SignerNonStandardSighash => write!(f, "Non-standard sighash type"),
            Self::SignerInvalidSighash => write!(f, "Invalid sighash type"),
            Self::SyncFailed => write!(f, "Sync failed"),
            Self::BroadcastFailed => write!(f, "Broadcast failed"),
            Self::InvalidTransaction => write!(f, "Invalid transaction"),
            Self::TransactionNotFound => write!(f, "Transaction not found"),
            Self::CannotConnect => write!(f, "Cannot connect chain update"),
            Self::CalculateFeeError => write!(f, "Cannot calculate fee"),
            Self::InvalidMnemonic => write!(f, "Invalid mnemonic"),
            Self::InvalidEntropy => write!(f, "Invalid entropy"),
            Self::KeyError => write!(f, "Key error"),
            Self::Generic => write!(f, "Generic error"),
        }
    }
}

impl std::error::Error for BdkError {}

// ── From impls for upstream error types ──────────────────────────────────────

impl From<bdk_wallet::descriptor::DescriptorError> for BdkError {
    fn from(_: bdk_wallet::descriptor::DescriptorError) -> Self {
        Self::InvalidDescriptor
    }
}

impl From<bdk_wallet::error::CreateTxError> for BdkError {
    fn from(e: bdk_wallet::error::CreateTxError) -> Self {
        use bdk_wallet::error::CreateTxError::*;
        match e {
            Descriptor(_) => Self::InvalidDescriptor,
            Policy(_) => Self::TransactionBuildFailed,
            SpendingPolicyRequired(_) => Self::SpendingPolicyRequired,
            Version0 => Self::VersionZero,
            Version1Csv => Self::VersionOneCsv,
            LockTime { .. } => Self::LockTimeConflict,
            RbfSequenceCsv { .. } => Self::RbfSequenceConflict,
            FeeTooLow { .. } => Self::FeeTooLow,
            FeeRateTooLow { .. } => Self::FeeRateTooLow,
            NoUtxosSelected => Self::NoUtxosSelected,
            OutputBelowDustLimit(_) => Self::OutputBelowDustLimit,
            CoinSelection(_) => Self::InsufficientFunds,
            NoRecipients => Self::NoRecipients,
            Psbt(_) => Self::InvalidPsbt,
            MissingKeyOrigin(_) => Self::MissingKeyOrigin,
            UnknownUtxo => Self::OutpointNotFound,
            MissingNonWitnessUtxo(_) => Self::MissingNonWitnessUtxo,
            MiniscriptPsbt(_) => Self::InvalidPsbt,
        }
    }
}

impl From<bdk_wallet::error::BuildFeeBumpError> for BdkError {
    fn from(e: bdk_wallet::error::BuildFeeBumpError) -> Self {
        use bdk_wallet::error::BuildFeeBumpError::*;
        match e {
            UnknownUtxo(_) => Self::OutpointNotFound,
            TransactionNotFound(_) => Self::FeeBumpTargetNotFound,
            TransactionConfirmed(_) => Self::FeeBumpAlreadyConfirmed,
            IrreplaceableTransaction(_) => Self::FeeBumpIrreplaceable,
            FeeRateUnavailable => Self::FeeBumpFeeRateUnavailable,
            InvalidOutputIndex(_) => Self::FeeBumpInvalidOutputIndex,
        }
    }
}

#[allow(deprecated)]
impl From<bdk_wallet::signer::SignerError> for BdkError {
    fn from(e: bdk_wallet::signer::SignerError) -> Self {
        use bdk_wallet::signer::SignerError::*;
        match e {
            MissingKey => Self::SignerMissingKey,
            InvalidKey => Self::SignerInvalidKey,
            UserCanceled => Self::SignerUserCanceled,
            InputIndexOutOfRange => Self::SignerInputIndexOutOfRange,
            MissingNonWitnessUtxo => Self::SignerMissingNonWitnessUtxo,
            InvalidNonWitnessUtxo => Self::SignerMissingNonWitnessUtxo,
            MissingWitnessUtxo => Self::SignerMissingWitnessUtxo,
            MissingWitnessScript => Self::SignerMissingWitnessScript,
            MissingHdKeypath => Self::SignerMissingKey,
            NonStandardSighash => Self::SignerNonStandardSighash,
            InvalidSighash => Self::SignerInvalidSighash,
            SighashTaproot(_) => Self::SignerInvalidSighash,
            MiniscriptPsbt(_) => Self::InvalidPsbt,
            External(_) => Self::SignFailed,
            Psbt(_) => Self::InvalidPsbt,
        }
    }
}

impl From<bdk_wallet::chain::local_chain::CannotConnectError> for BdkError {
    fn from(_: bdk_wallet::chain::local_chain::CannotConnectError) -> Self {
        Self::CannotConnect
    }
}

impl From<bdk_wallet::LoadError> for BdkError {
    fn from(e: bdk_wallet::LoadError) -> Self {
        match e {
            bdk_wallet::LoadError::Mismatch(_) => Self::WalletLoadMismatch,
            _ => Self::WalletLoadFailed,
        }
    }
}

impl From<bdk_wallet::rusqlite::Error> for BdkError {
    fn from(_: bdk_wallet::rusqlite::Error) -> Self {
        Self::PersistError
    }
}

impl From<bdk_wallet::tx_builder::AddUtxoError> for BdkError {
    fn from(_: bdk_wallet::tx_builder::AddUtxoError) -> Self {
        Self::OutpointNotFound
    }
}

impl From<bdk_wallet::keys::KeyError> for BdkError {
    fn from(_: bdk_wallet::keys::KeyError) -> Self {
        Self::KeyError
    }
}

impl<E: std::fmt::Debug> From<bdk_wallet::CreateWithPersistError<E>> for BdkError {
    fn from(e: bdk_wallet::CreateWithPersistError<E>) -> Self {
        match e {
            bdk_wallet::CreateWithPersistError::Persist(_) => Self::PersistError,
            bdk_wallet::CreateWithPersistError::Descriptor(_) => Self::InvalidDescriptor,
            bdk_wallet::CreateWithPersistError::DataAlreadyExists(_) => Self::WalletCreationFailed,
        }
    }
}

impl<E: std::fmt::Debug> From<bdk_wallet::LoadWithPersistError<E>> for BdkError {
    fn from(e: bdk_wallet::LoadWithPersistError<E>) -> Self {
        match e {
            bdk_wallet::LoadWithPersistError::Persist(_) => Self::PersistError,
            bdk_wallet::LoadWithPersistError::InvalidChangeSet(load_err) => load_err.into(),
        }
    }
}
