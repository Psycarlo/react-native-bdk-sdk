import { type UniffiByteArray, type UniffiGcObject, type UniffiHandle, FfiConverterObject, RustBuffer, UniffiAbstractObject, destructorGuardSymbol, pointerLiteralSymbol, uniffiTypeNameSymbol, variantOrdinalSymbol } from "uniffi-bindgen-react-native";
/**
 * Generate an output descriptor string from a mnemonic using a standard BIP template.
 * Returns a descriptor like "wpkh([fingerprint/84'/0'/0']xprv.../0/*)" for BIP84.
 * Uses Bip44/49/84/86 descriptor templates.
 */
export declare function createDescriptor(mnemonic: MnemonicInterface, template: DescriptorTemplate, keychain: KeychainKind, network: Network): string;
/**
 * Generate a public (watch-only) descriptor from an xpub string using a standard BIP template.
 * Returns a descriptor like "wpkh([fingerprint/84'/0'/0']xpub.../0/*)" for BIP84.
 * Uses Bip44Public/49Public/84Public/86Public descriptor templates.
 */
export declare function createPublicDescriptor(xpub: string, template: DescriptorTemplate, keychain: KeychainKind, network: Network): string;
/**
 * Generate a single-key descriptor from a key string.
 * Uses P2Pkh, P2Wpkh, P2Wpkh_P2Sh, or P2TR templates.
 */
export declare function createSingleKeyDescriptor(key: string, template: SingleKeyDescriptorTemplate, network: Network): string;
/**
 * Export a wallet in FullyNoded-compatible JSON format for backup.
 * Mirrors bdk_wallet::export::FullyNodedExport.
 */
export declare function exportWallet(wallet: WalletInterface, label: string, includeBlockHeight: boolean): string;
/**
 * Returns true if the address string is valid for the given network.
 */
export declare function isValidAddress(address: string, network: Network): boolean;
/**
 * Runtime version of the bdk_wallet crate.
 */
export declare function version(): string;
/**
 * Compute a deterministic wallet name from its descriptors (useful for DB naming).
 * Mirrors bdk_wallet::wallet_name_from_descriptor().
 */
export declare function walletNameFromDescriptor(descriptor: string, changeDescriptor: string | undefined, network: Network): string;
/**
 * A derived address with its derivation index. Mirrors bdk_wallet::AddressInfo.
 */
export type AddressInfo = {
    index: number;
    address: string;
    keychain: KeychainKind;
};
/**
 * Generated factory for {@link AddressInfo} record objects.
 */
export declare const AddressInfo: Readonly<{
    /**
     * Create a frozen instance of {@link AddressInfo}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<AddressInfo> & Required<Omit<AddressInfo, never>>) => AddressInfo;
    /**
     * Create a frozen instance of {@link AddressInfo}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<AddressInfo> & Required<Omit<AddressInfo, never>>) => AddressInfo;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<AddressInfo>;
}>;
/**
 * Wallet balance split into categories. All values in satoshis.
 * Mirrors bdk_wallet::Balance (re-exported from bdk_chain).
 */
export type Balance = {
    /**
     * Coinbase outputs not yet matured (< 100 confirmations).
     */
    immature: bigint;
    /**
     * Unconfirmed UTXOs from transactions we sent ourselves.
     */
    trustedPending: bigint;
    /**
     * Unconfirmed UTXOs received from external wallets.
     */
    untrustedPending: bigint;
    /**
     * Confirmed and immediately spendable.
     */
    confirmed: bigint;
    /**
     * trusted_pending + confirmed (safe to spend without double-spend risk).
     */
    trustedSpendable: bigint;
    /**
     * Sum of all four categories.
     */
    total: bigint;
};
/**
 * Generated factory for {@link Balance} record objects.
 */
export declare const Balance: Readonly<{
    /**
     * Create a frozen instance of {@link Balance}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<Balance> & Required<Omit<Balance, never>>) => Balance;
    /**
     * Create a frozen instance of {@link Balance}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<Balance> & Required<Omit<Balance, never>>) => Balance;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<Balance>;
}>;
/**
 * A block identifier (height + hash). Mirrors bdk_chain::BlockId.
 */
export type BlockId = {
    height: number;
    hash: string;
};
/**
 * Generated factory for {@link BlockId} record objects.
 */
export declare const BlockId: Readonly<{
    /**
     * Create a frozen instance of {@link BlockId}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<BlockId> & Required<Omit<BlockId, never>>) => BlockId;
    /**
     * Create a frozen instance of {@link BlockId}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<BlockId> & Required<Omit<BlockId, never>>) => BlockId;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<BlockId>;
}>;
/**
 * Block position for a confirmed transaction/output.
 * Mirrors bdk_chain::ConfirmationBlockTime.
 */
export type ConfirmationBlockTime = {
    height: number;
    /**
     * Block hash as hex.
     */
    blockHash: string;
    /**
     * Unix timestamp of the block.
     */
    timestamp: bigint;
};
/**
 * Generated factory for {@link ConfirmationBlockTime} record objects.
 */
export declare const ConfirmationBlockTime: Readonly<{
    /**
     * Create a frozen instance of {@link ConfirmationBlockTime}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<ConfirmationBlockTime> & Required<Omit<ConfirmationBlockTime, never>>) => ConfirmationBlockTime;
    /**
     * Create a frozen instance of {@link ConfirmationBlockTime}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<ConfirmationBlockTime> & Required<Omit<ConfirmationBlockTime, never>>) => ConfirmationBlockTime;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<ConfirmationBlockTime>;
}>;
/**
 * Derivation info for a scriptPubKey belonging to the wallet.
 */
export type DerivationInfo = {
    keychain: KeychainKind;
    index: number;
};
/**
 * Generated factory for {@link DerivationInfo} record objects.
 */
export declare const DerivationInfo: Readonly<{
    /**
     * Create a frozen instance of {@link DerivationInfo}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<DerivationInfo> & Required<Omit<DerivationInfo, never>>) => DerivationInfo;
    /**
     * Create a frozen instance of {@link DerivationInfo}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<DerivationInfo> & Required<Omit<DerivationInfo, never>>) => DerivationInfo;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<DerivationInfo>;
}>;
/**
 * Info about a keychain and its associated descriptor.
 */
export type KeychainInfo = {
    keychain: KeychainKind;
    /**
     * The public descriptor string.
     */
    descriptor: string;
};
/**
 * Generated factory for {@link KeychainInfo} record objects.
 */
export declare const KeychainInfo: Readonly<{
    /**
     * Create a frozen instance of {@link KeychainInfo}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<KeychainInfo> & Required<Omit<KeychainInfo, never>>) => KeychainInfo;
    /**
     * Create a frozen instance of {@link KeychainInfo}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<KeychainInfo> & Required<Omit<KeychainInfo, never>>) => KeychainInfo;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<KeychainInfo>;
}>;
/**
 * A wallet-owned output (spent or unspent). Mirrors bdk_wallet::LocalOutput.
 */
export type LocalOutput = {
    outpoint: OutPoint;
    txout: TxOut;
    keychain: KeychainKind;
    isSpent: boolean;
    derivationIndex: number;
    /**
     * None when the output is unconfirmed.
     */
    confirmationBlockTime: ConfirmationBlockTime | undefined;
};
/**
 * Generated factory for {@link LocalOutput} record objects.
 */
export declare const LocalOutput: Readonly<{
    /**
     * Create a frozen instance of {@link LocalOutput}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<LocalOutput> & Required<Omit<LocalOutput, never>>) => LocalOutput;
    /**
     * Create a frozen instance of {@link LocalOutput}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<LocalOutput> & Required<Omit<LocalOutput, never>>) => LocalOutput;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<LocalOutput>;
}>;
/**
 * Reference to a specific transaction output. Mirrors bitcoin::OutPoint.
 */
export type OutPoint = {
    txid: string;
    vout: number;
};
/**
 * Generated factory for {@link OutPoint} record objects.
 */
export declare const OutPoint: Readonly<{
    /**
     * Create a frozen instance of {@link OutPoint}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<OutPoint> & Required<Omit<OutPoint, never>>) => OutPoint;
    /**
     * Create a frozen instance of {@link OutPoint}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<OutPoint> & Required<Omit<OutPoint, never>>) => OutPoint;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<OutPoint>;
}>;
/**
 * A single payment recipient.
 */
export type Recipient = {
    address: string;
    /**
     * Amount in satoshis.
     */
    amountSats: bigint;
};
/**
 * Generated factory for {@link Recipient} record objects.
 */
export declare const Recipient: Readonly<{
    /**
     * Create a frozen instance of {@link Recipient}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<Recipient> & Required<Omit<Recipient, never>>) => Recipient;
    /**
     * Create a frozen instance of {@link Recipient}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<Recipient> & Required<Omit<Recipient, never>>) => Recipient;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<Recipient>;
}>;
/**
 * How much was sent from / received into the wallet for a given transaction.
 */
export type SentAndReceived = {
    /**
     * Satoshis sent (wallet inputs consumed).
     */
    sent: bigint;
    /**
     * Satoshis received (wallet outputs created).
     */
    received: bigint;
};
/**
 * Generated factory for {@link SentAndReceived} record objects.
 */
export declare const SentAndReceived: Readonly<{
    /**
     * Create a frozen instance of {@link SentAndReceived}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<SentAndReceived> & Required<Omit<SentAndReceived, never>>) => SentAndReceived;
    /**
     * Create a frozen instance of {@link SentAndReceived}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<SentAndReceived> & Required<Omit<SentAndReceived, never>>) => SentAndReceived;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<SentAndReceived>;
}>;
/**
 * Full details of a wallet-relevant transaction. Mirrors bdk_wallet::TxDetails.
 */
export type TxDetails = {
    txid: string;
    /**
     * Sum of wallet-owned input amounts (satoshis).
     */
    sent: bigint;
    /**
     * Sum of amounts to wallet-owned outputs (satoshis).
     */
    received: bigint;
    /**
     * Fee paid in satoshis. None if some inputs are unknown.
     */
    fee: /*u64*/ bigint | undefined;
    /**
     * Fee rate in sat/vbyte. None if some inputs are unknown.
     */
    feeRate: /*f64*/ number | undefined;
    /**
     * Net change to wallet balance in satoshis (positive = received more than sent).
     */
    balanceDelta: bigint;
    /**
     * None when unconfirmed.
     */
    confirmationBlockTime: ConfirmationBlockTime | undefined;
    /**
     * The full serialized transaction as hex.
     */
    txHex: string;
};
/**
 * Generated factory for {@link TxDetails} record objects.
 */
export declare const TxDetails: Readonly<{
    /**
     * Create a frozen instance of {@link TxDetails}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<TxDetails> & Required<Omit<TxDetails, never>>) => TxDetails;
    /**
     * Create a frozen instance of {@link TxDetails}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<TxDetails> & Required<Omit<TxDetails, never>>) => TxDetails;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<TxDetails>;
}>;
/**
 * A transaction output (value + locking script). Mirrors bitcoin::TxOut.
 */
export type TxOut = {
    /**
     * Value in satoshis.
     */
    value: bigint;
    /**
     * Serialized scriptPubKey as lowercase hex.
     */
    scriptPubkeyHex: string;
};
/**
 * Generated factory for {@link TxOut} record objects.
 */
export declare const TxOut: Readonly<{
    /**
     * Create a frozen instance of {@link TxOut}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    create: (partial: Partial<TxOut> & Required<Omit<TxOut, never>>) => TxOut;
    /**
     * Create a frozen instance of {@link TxOut}, with defaults specified
     * in Rust, in the {@link bdk_ffi} crate.
     */
    new: (partial: Partial<TxOut> & Required<Omit<TxOut, never>>) => TxOut;
    /**
     * Defaults specified in the {@link bdk_ffi} crate.
     */
    defaults: () => Partial<TxOut>;
}>;
export declare enum BdkError_Tags {
    InvalidDescriptor = "InvalidDescriptor",
    WalletCreationFailed = "WalletCreationFailed",
    WalletLoadFailed = "WalletLoadFailed",
    WalletLoadMismatch = "WalletLoadMismatch",
    PersistError = "PersistError",
    InvalidAddress = "InvalidAddress",
    InvalidScript = "InvalidScript",
    TransactionBuildFailed = "TransactionBuildFailed",
    NoRecipients = "NoRecipients",
    NoUtxosSelected = "NoUtxosSelected",
    OutputBelowDustLimit = "OutputBelowDustLimit",
    InsufficientFunds = "InsufficientFunds",
    FeeRateTooLow = "FeeRateTooLow",
    FeeTooLow = "FeeTooLow",
    LockTimeConflict = "LockTimeConflict",
    RbfSequenceConflict = "RbfSequenceConflict",
    VersionZero = "VersionZero",
    VersionOneCsv = "VersionOneCsv",
    SpendingPolicyRequired = "SpendingPolicyRequired",
    MissingKeyOrigin = "MissingKeyOrigin",
    MissingNonWitnessUtxo = "MissingNonWitnessUtxo",
    OutpointNotFound = "OutpointNotFound",
    FeeBumpTargetNotFound = "FeeBumpTargetNotFound",
    FeeBumpAlreadyConfirmed = "FeeBumpAlreadyConfirmed",
    FeeBumpIrreplaceable = "FeeBumpIrreplaceable",
    FeeBumpFeeRateUnavailable = "FeeBumpFeeRateUnavailable",
    FeeBumpInvalidOutputIndex = "FeeBumpInvalidOutputIndex",
    InvalidPsbt = "InvalidPsbt",
    SignFailed = "SignFailed",
    SignerMissingKey = "SignerMissingKey",
    SignerInvalidKey = "SignerInvalidKey",
    SignerUserCanceled = "SignerUserCanceled",
    SignerInputIndexOutOfRange = "SignerInputIndexOutOfRange",
    SignerMissingNonWitnessUtxo = "SignerMissingNonWitnessUtxo",
    SignerMissingWitnessUtxo = "SignerMissingWitnessUtxo",
    SignerMissingWitnessScript = "SignerMissingWitnessScript",
    SignerNonStandardSighash = "SignerNonStandardSighash",
    SignerInvalidSighash = "SignerInvalidSighash",
    SyncFailed = "SyncFailed",
    BroadcastFailed = "BroadcastFailed",
    InvalidTransaction = "InvalidTransaction",
    TransactionNotFound = "TransactionNotFound",
    CannotConnect = "CannotConnect",
    CalculateFeeError = "CalculateFeeError",
    InvalidMnemonic = "InvalidMnemonic",
    InvalidEntropy = "InvalidEntropy",
    KeyError = "KeyError",
    Generic = "Generic"
}
export declare const BdkError: {
    InvalidDescriptor: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 1;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 1;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    WalletCreationFailed: {
        new (message: string): {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 2;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 2;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    WalletLoadFailed: {
        new (message: string): {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 3;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 3;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    WalletLoadMismatch: {
        new (message: string): {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 4;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 4;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    PersistError: {
        new (message: string): {
            readonly tag: BdkError_Tags.PersistError;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 5;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.PersistError;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 5;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidAddress: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidAddress;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 6;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidAddress;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 6;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidScript: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidScript;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 7;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidScript;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 7;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    TransactionBuildFailed: {
        new (message: string): {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 8;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 8;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    NoRecipients: {
        new (message: string): {
            readonly tag: BdkError_Tags.NoRecipients;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 9;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.NoRecipients;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 9;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    NoUtxosSelected: {
        new (message: string): {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 10;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 10;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    OutputBelowDustLimit: {
        new (message: string): {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 11;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 11;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InsufficientFunds: {
        new (message: string): {
            readonly tag: BdkError_Tags.InsufficientFunds;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 12;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InsufficientFunds;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 12;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeRateTooLow: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 13;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 13;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeTooLow: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeTooLow;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 14;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeTooLow;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 14;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    LockTimeConflict: {
        new (message: string): {
            readonly tag: BdkError_Tags.LockTimeConflict;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 15;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.LockTimeConflict;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 15;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    RbfSequenceConflict: {
        new (message: string): {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 16;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 16;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    VersionZero: {
        new (message: string): {
            readonly tag: BdkError_Tags.VersionZero;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 17;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.VersionZero;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 17;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    VersionOneCsv: {
        new (message: string): {
            readonly tag: BdkError_Tags.VersionOneCsv;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 18;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.VersionOneCsv;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 18;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SpendingPolicyRequired: {
        new (message: string): {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 19;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 19;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    MissingKeyOrigin: {
        new (message: string): {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 20;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 20;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    MissingNonWitnessUtxo: {
        new (message: string): {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 21;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 21;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    OutpointNotFound: {
        new (message: string): {
            readonly tag: BdkError_Tags.OutpointNotFound;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 22;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.OutpointNotFound;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 22;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpTargetNotFound: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 23;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 23;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpAlreadyConfirmed: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 24;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 24;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpIrreplaceable: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 25;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 25;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpFeeRateUnavailable: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 26;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 26;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpInvalidOutputIndex: {
        new (message: string): {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 27;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 27;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidPsbt: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidPsbt;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 28;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidPsbt;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 28;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignFailed: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 29;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 29;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingKey: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerMissingKey;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 30;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerMissingKey;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 30;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerInvalidKey: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 31;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 31;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerUserCanceled: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 32;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 32;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerInputIndexOutOfRange: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 33;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 33;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingNonWitnessUtxo: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 34;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 34;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingWitnessUtxo: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 35;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 35;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingWitnessScript: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 36;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 36;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerNonStandardSighash: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 37;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 37;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerInvalidSighash: {
        new (message: string): {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 38;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 38;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SyncFailed: {
        new (message: string): {
            readonly tag: BdkError_Tags.SyncFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 39;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.SyncFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 39;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    BroadcastFailed: {
        new (message: string): {
            readonly tag: BdkError_Tags.BroadcastFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 40;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.BroadcastFailed;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 40;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidTransaction: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidTransaction;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 41;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidTransaction;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 41;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    TransactionNotFound: {
        new (message: string): {
            readonly tag: BdkError_Tags.TransactionNotFound;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 42;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.TransactionNotFound;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 42;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    CannotConnect: {
        new (message: string): {
            readonly tag: BdkError_Tags.CannotConnect;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 43;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.CannotConnect;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 43;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    CalculateFeeError: {
        new (message: string): {
            readonly tag: BdkError_Tags.CalculateFeeError;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 44;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.CalculateFeeError;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 44;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidMnemonic: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 45;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 45;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidEntropy: {
        new (message: string): {
            readonly tag: BdkError_Tags.InvalidEntropy;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 46;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.InvalidEntropy;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 46;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    KeyError: {
        new (message: string): {
            readonly tag: BdkError_Tags.KeyError;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 47;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.KeyError;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 47;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    Generic: {
        new (message: string): {
            readonly tag: BdkError_Tags.Generic;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 48;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(e: any): e is {
            readonly tag: BdkError_Tags.Generic;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [uniffiTypeNameSymbol]: string;
            /**
             * @private
             * This field is private and should not be used.
             */
            readonly [variantOrdinalSymbol]: 48;
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    instanceOf: (e: any) => e is BdkError;
};
export type BdkError = InstanceType<(typeof BdkError)[keyof Omit<typeof BdkError, "instanceOf">]>;
/**
 * Controls which UTXOs the wallet may spend as change inputs.
 */
export declare enum ChangeSpendPolicy {
    /**
     * Both change and non-change outputs may be spent (default).
     */
    ChangeAllowed = 0,
    /**
     * Only change outputs may be spent as inputs.
     */
    OnlyChange = 1,
    /**
     * Only non-change outputs may be spent as inputs.
     */
    ChangeForbidden = 2
}
/**
 * Standard BIP descriptor templates for generating wallet descriptors
 * from a mnemonic/xprv (also usable for xpub via create_public_descriptor).
 * Mirrors descriptor::template::{Bip44, Bip49, Bip84, Bip86}.
 */
export declare enum DescriptorTemplate {
    /**
     * BIP44 — Legacy P2PKH (1…)
     */
    Bip44 = 0,
    /**
     * BIP49 — Nested SegWit P2SH-P2WPKH (3…)
     */
    Bip49 = 1,
    /**
     * BIP84 — Native SegWit P2WPKH (bc1q…)
     */
    Bip84 = 2,
    /**
     * BIP86 — Taproot P2TR (bc1p…)
     */
    Bip86 = 3
}
export declare enum KeychainKind {
    /**
     * External keychain — used for deriving recipient addresses.
     */
    External = 0,
    /**
     * Internal keychain — used for deriving change addresses.
     */
    Internal = 1
}
/**
 * BIP-39 mnemonic language. Mirrors bip39::Language.
 * Requires `all-languages` feature on the bip39 crate.
 */
export declare enum Language {
    English = 0,
    SimplifiedChinese = 1,
    TraditionalChinese = 2,
    Czech = 3,
    French = 4,
    Italian = 5,
    Japanese = 6,
    Korean = 7,
    Portuguese = 8,
    Spanish = 9
}
export declare enum Network {
    Bitcoin = 0,
    Testnet = 1,
    Signet = 2,
    Regtest = 3
}
/**
 * Single-key descriptor templates.
 * Mirrors descriptor::template::{P2Pkh, P2Wpkh, P2Wpkh_P2Sh, P2TR}.
 */
export declare enum SingleKeyDescriptorTemplate {
    /**
     * Pay-to-PubKey-Hash — Legacy (1…)
     */
    P2Pkh = 0,
    /**
     * Pay-to-Witness-PubKey-Hash — Native SegWit (bc1q…)
     */
    P2Wpkh = 1,
    /**
     * P2Wpkh wrapped in P2SH — Nested SegWit (3…)
     */
    P2WpkhP2Sh = 2,
    /**
     * Pay-to-Taproot (bc1p…)
     */
    P2tr = 3
}
/**
 * Ordering applied to inputs and outputs when building a transaction.
 * Note: bdk_wallet also has a Custom variant (with closures) that cannot cross FFI.
 */
export declare enum TxOrdering {
    /**
     * Randomise input and output order (default, good for privacy).
     */
    Shuffle = 0,
    /**
     * Preserve insertion order of recipients and manually added UTXOs.
     */
    Untouched = 1
}
export declare enum WalletEvent_Tags {
    ChainTipChanged = "ChainTipChanged",
    TxConfirmed = "TxConfirmed",
    TxUnconfirmed = "TxUnconfirmed",
    TxReplaced = "TxReplaced",
    TxDropped = "TxDropped"
}
/**
 * Events emitted when applying chain updates to the wallet.
 * Mirrors bdk_wallet::event::WalletEvent (non-exhaustive in upstream).
 */
export declare const WalletEvent: Readonly<{
    instanceOf: (obj: any) => obj is WalletEvent;
    ChainTipChanged: {
        new (inner: {
            oldTip: BlockId;
            newTip: BlockId;
        }): {
            readonly tag: WalletEvent_Tags.ChainTipChanged;
            readonly inner: Readonly<{
                oldTip: BlockId;
                newTip: BlockId;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        "new"(inner: {
            oldTip: BlockId;
            newTip: BlockId;
        }): {
            readonly tag: WalletEvent_Tags.ChainTipChanged;
            readonly inner: Readonly<{
                oldTip: BlockId;
                newTip: BlockId;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        instanceOf(obj: any): obj is {
            readonly tag: WalletEvent_Tags.ChainTipChanged;
            readonly inner: Readonly<{
                oldTip: BlockId;
                newTip: BlockId;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
    };
    TxConfirmed: {
        new (inner: {
            txid: string;
            blockTime: ConfirmationBlockTime;
        }): {
            readonly tag: WalletEvent_Tags.TxConfirmed;
            readonly inner: Readonly<{
                txid: string;
                blockTime: ConfirmationBlockTime;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        "new"(inner: {
            txid: string;
            blockTime: ConfirmationBlockTime;
        }): {
            readonly tag: WalletEvent_Tags.TxConfirmed;
            readonly inner: Readonly<{
                txid: string;
                blockTime: ConfirmationBlockTime;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        instanceOf(obj: any): obj is {
            readonly tag: WalletEvent_Tags.TxConfirmed;
            readonly inner: Readonly<{
                txid: string;
                blockTime: ConfirmationBlockTime;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
    };
    TxUnconfirmed: {
        new (inner: {
            txid: string;
        }): {
            readonly tag: WalletEvent_Tags.TxUnconfirmed;
            readonly inner: Readonly<{
                txid: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        "new"(inner: {
            txid: string;
        }): {
            readonly tag: WalletEvent_Tags.TxUnconfirmed;
            readonly inner: Readonly<{
                txid: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        instanceOf(obj: any): obj is {
            readonly tag: WalletEvent_Tags.TxUnconfirmed;
            readonly inner: Readonly<{
                txid: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
    };
    TxReplaced: {
        new (inner: {
            txid: string;
            conflictingTxids: Array<string>;
        }): {
            readonly tag: WalletEvent_Tags.TxReplaced;
            readonly inner: Readonly<{
                txid: string;
                conflictingTxids: Array<string>;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        "new"(inner: {
            txid: string;
            conflictingTxids: Array<string>;
        }): {
            readonly tag: WalletEvent_Tags.TxReplaced;
            readonly inner: Readonly<{
                txid: string;
                conflictingTxids: Array<string>;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        instanceOf(obj: any): obj is {
            readonly tag: WalletEvent_Tags.TxReplaced;
            readonly inner: Readonly<{
                txid: string;
                conflictingTxids: Array<string>;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
    };
    TxDropped: {
        new (inner: {
            txid: string;
        }): {
            readonly tag: WalletEvent_Tags.TxDropped;
            readonly inner: Readonly<{
                txid: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        "new"(inner: {
            txid: string;
        }): {
            readonly tag: WalletEvent_Tags.TxDropped;
            readonly inner: Readonly<{
                txid: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
        instanceOf(obj: any): obj is {
            readonly tag: WalletEvent_Tags.TxDropped;
            readonly inner: Readonly<{
                txid: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "WalletEvent";
        };
    };
}>;
/**
 * Events emitted when applying chain updates to the wallet.
 * Mirrors bdk_wallet::event::WalletEvent (non-exhaustive in upstream).
 */
export type WalletEvent = InstanceType<(typeof WalletEvent)[keyof Omit<typeof WalletEvent, "instanceOf">]>;
/**
 * BIP-39 mnemonic word count (determines entropy length).
 */
export declare enum WordCount {
    Words12 = 0,
    Words15 = 1,
    Words18 = 2,
    Words21 = 3,
    Words24 = 4
}
/**
 * BIP-39 mnemonic phrase for key generation.
 * Backed by bdk_wallet::keys::bip39::Mnemonic (requires `keys-bip39` feature).
 */
export interface MnemonicInterface {
    /**
     * The language of this mnemonic.
     */
    language(): Language;
    /**
     * Derive the 64-byte seed as hex. Pass an empty string for no passphrase.
     */
    toSeedHex(passphrase: string): string;
    /**
     * The mnemonic as a space-separated word string.
     */
    toString(): string;
    /**
     * Number of words (12, 15, 18, 21, or 24).
     */
    wordCount(): number;
    /**
     * List the individual words.
     */
    words(): Array<string>;
}
/**
 * BIP-39 mnemonic phrase for key generation.
 * Backed by bdk_wallet::keys::bip39::Mnemonic (requires `keys-bip39` feature).
 */
export declare class Mnemonic extends UniffiAbstractObject implements MnemonicInterface {
    readonly [uniffiTypeNameSymbol] = "Mnemonic";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    /**
     * Generate a new random mnemonic with the given word count (English).
     */
    constructor(wordCount: WordCount);
    /**
     * Create a mnemonic from raw entropy bytes (16–32 bytes).
     */
    static fromEntropy(entropy: Array</*u8*/ number>): MnemonicInterface;
    /**
     * Create a mnemonic from raw entropy bytes in a specific language.
     */
    static fromEntropyIn(entropy: Array</*u8*/ number>, language: Language): MnemonicInterface;
    /**
     * Parse an existing mnemonic string (auto-detects language).
     */
    static fromString(mnemonic: string): MnemonicInterface;
    /**
     * Parse a mnemonic string in a specific language.
     */
    static fromStringIn(mnemonic: string, language: Language): MnemonicInterface;
    /**
     * The language of this mnemonic.
     */
    language(): Language;
    /**
     * Derive the 64-byte seed as hex. Pass an empty string for no passphrase.
     */
    toSeedHex(passphrase: string): string;
    /**
     * The mnemonic as a space-separated word string.
     */
    toString(): string;
    /**
     * Number of words (12, 15, 18, 21, or 24).
     */
    wordCount(): number;
    /**
     * List the individual words.
     */
    words(): Array<string>;
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is Mnemonic;
}
/**
 * A Partially Signed Bitcoin Transaction (BIP-174 / BIP-370).
 * Mirrors bitcoin::Psbt with added PsbtUtils trait methods.
 */
export interface PsbtInterface {
    /**
     * Extract the fully-signed transaction as raw hex.
     * Only valid after all inputs are finalized.
     */
    extractTxHex(): string;
    /**
     * Total fee in satoshis. None if any input UTXO value is unknown.
     * From PsbtUtils::fee_amount().
     */
    feeAmount(): /*u64*/ bigint | undefined;
    /**
     * Fee rate in sat/vbyte. None if any input UTXO value is unknown.
     * From PsbtUtils::fee_rate().
     */
    feeRate(): /*f64*/ number | undefined;
    /**
     * Retrieve the UTXO for a given input index. Returns None if unavailable.
     * From PsbtUtils::get_utxo_for().
     */
    getUtxoFor(inputIndex: bigint): TxOut | undefined;
    /**
     * Serialize to a base64-encoded string.
     */
    toBase64(): string;
    /**
     * The unsigned txid (available before finalization).
     */
    txid(): string;
}
/**
 * A Partially Signed Bitcoin Transaction (BIP-174 / BIP-370).
 * Mirrors bitcoin::Psbt with added PsbtUtils trait methods.
 */
export declare class Psbt extends UniffiAbstractObject implements PsbtInterface {
    readonly [uniffiTypeNameSymbol] = "Psbt";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    /**
     * Deserialize from a base64-encoded string.
     */
    constructor(psbtBase64: string);
    /**
     * Extract the fully-signed transaction as raw hex.
     * Only valid after all inputs are finalized.
     */
    extractTxHex(): string;
    /**
     * Total fee in satoshis. None if any input UTXO value is unknown.
     * From PsbtUtils::fee_amount().
     */
    feeAmount(): /*u64*/ bigint | undefined;
    /**
     * Fee rate in sat/vbyte. None if any input UTXO value is unknown.
     * From PsbtUtils::fee_rate().
     */
    feeRate(): /*f64*/ number | undefined;
    /**
     * Retrieve the UTXO for a given input index. Returns None if unavailable.
     * From PsbtUtils::get_utxo_for().
     */
    getUtxoFor(inputIndex: bigint): TxOut | undefined;
    /**
     * Serialize to a base64-encoded string.
     */
    toBase64(): string;
    /**
     * The unsigned txid (available before finalization).
     */
    txid(): string;
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is Psbt;
}
/**
 * Fluent builder for constructing Bitcoin transactions.
 * Create one, configure it, then call finish(wallet) to produce a PSBT.
 * Mirrors bdk_wallet::TxBuilder (without lifetime / generic coin selection).
 */
export interface TxBuilderInterface {
    /**
     * Attach OP_RETURN data to the transaction.
     */
    addData(data: Array</*u8*/ number>): void;
    /**
     * Include BIP-32 global xpubs in the PSBT.
     */
    addGlobalXpubs(): void;
    /**
     * Add a single recipient (address + amount).
     */
    addRecipient(address: string, amountSats: bigint): void;
    /**
     * Mark a single UTXO as unspendable.
     */
    addUnspendable(outpoint: OutPoint): void;
    /**
     * Add a specific UTXO to spend.
     */
    addUtxo(outpoint: OutPoint): void;
    /**
     * Add multiple specific UTXOs to spend.
     */
    addUtxos(outpoints: Array<OutPoint>): void;
    /**
     * Allow outputs below the dust threshold.
     */
    allowDust(allow: boolean): void;
    /**
     * Set the change spend policy explicitly.
     */
    changePolicy(policy: ChangeSpendPolicy): void;
    /**
     * Set the assumed current block height (for relative timelock evaluation).
     */
    currentHeight(height: number): void;
    /**
     * Forbid spending from change outputs.
     */
    doNotSpendChange(): void;
    /**
     * Set the script to receive the remaining change (use with drain_wallet).
     */
    drainTo(address: string): void;
    /**
     * Spend all spendable UTXOs (send remaining to the drain_to address).
     */
    drainWallet(): void;
    /**
     * Enable RBF signalling with the default nSequence (0xFFFFFFFD).
     */
    enableRbf(): void;
    /**
     * Enable RBF signalling with a specific nSequence value (must be < 0xFFFFFFFE).
     */
    enableRbfWithSequence(nsequence: number): void;
    /**
     * Exclude UTXOs with fewer than min_confirms confirmations.
     */
    excludeBelowConfirmations(minConfirms: number): void;
    /**
     * Exclude all unconfirmed UTXOs.
     */
    excludeUnconfirmed(): void;
    /**
     * Set an absolute fee in satoshis (overrides fee_rate).
     */
    feeAbsolute(feeSats: bigint): void;
    /**
     * Set a fee rate target in sat/vbyte.
     */
    feeRate(satPerVbyte: number): void;
    /**
     * Build the transaction into a PSBT. The wallet is used for coin
     * selection and script resolution — the PSBT is NOT signed here.
     */
    finish(wallet: WalletInterface): PsbtInterface;
    /**
     * Include the redeemScript / witnessScript in PSBT outputs.
     */
    includeOutputRedeemWitnessScript(): void;
    /**
     * Only use the UTXOs explicitly added with add_utxo / add_utxos.
     */
    manuallySelectedOnly(): void;
    /**
     * Set an explicit nLockTime (as a block height).
     */
    nlocktime(lockHeight: number): void;
    /**
     * Only spend from change outputs.
     */
    onlySpendChange(): void;
    /**
     * Include only witness UTXO in PSBT inputs (reduced size, less validation).
     */
    onlyWitnessUtxo(): void;
    /**
     * Set the input/output ordering strategy.
     */
    ordering(ordering: TxOrdering): void;
    /**
     * Supply a policy path for complex descriptors (multisig, timelocks).
     * path_map is a JSON-encoded BTreeMap<String, Vec<usize>>.
     */
    policyPath(pathMapJson: string, keychain: KeychainKind): void;
    /**
     * Set an exact nSequence value for all inputs.
     */
    setExactSequence(nsequence: number): void;
    /**
     * Replace the entire recipient list.
     */
    setRecipients(recipients: Array<Recipient>): void;
    /**
     * Set the sighash type for all inputs.
     */
    sighash(sighashType: number): void;
    /**
     * Set the transaction version (1 or 2).
     */
    txVersion(version: number): void;
    /**
     * Mark UTXOs as unspendable (excluded from coin selection).
     */
    unspendable(outpoints: Array<OutPoint>): void;
}
/**
 * Fluent builder for constructing Bitcoin transactions.
 * Create one, configure it, then call finish(wallet) to produce a PSBT.
 * Mirrors bdk_wallet::TxBuilder (without lifetime / generic coin selection).
 */
export declare class TxBuilder extends UniffiAbstractObject implements TxBuilderInterface {
    readonly [uniffiTypeNameSymbol] = "TxBuilder";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    constructor();
    /**
     * Attach OP_RETURN data to the transaction.
     */
    addData(data: Array</*u8*/ number>): void;
    /**
     * Include BIP-32 global xpubs in the PSBT.
     */
    addGlobalXpubs(): void;
    /**
     * Add a single recipient (address + amount).
     */
    addRecipient(address: string, amountSats: bigint): void;
    /**
     * Mark a single UTXO as unspendable.
     */
    addUnspendable(outpoint: OutPoint): void;
    /**
     * Add a specific UTXO to spend.
     */
    addUtxo(outpoint: OutPoint): void;
    /**
     * Add multiple specific UTXOs to spend.
     */
    addUtxos(outpoints: Array<OutPoint>): void;
    /**
     * Allow outputs below the dust threshold.
     */
    allowDust(allow: boolean): void;
    /**
     * Set the change spend policy explicitly.
     */
    changePolicy(policy: ChangeSpendPolicy): void;
    /**
     * Set the assumed current block height (for relative timelock evaluation).
     */
    currentHeight(height: number): void;
    /**
     * Forbid spending from change outputs.
     */
    doNotSpendChange(): void;
    /**
     * Set the script to receive the remaining change (use with drain_wallet).
     */
    drainTo(address: string): void;
    /**
     * Spend all spendable UTXOs (send remaining to the drain_to address).
     */
    drainWallet(): void;
    /**
     * Enable RBF signalling with the default nSequence (0xFFFFFFFD).
     */
    enableRbf(): void;
    /**
     * Enable RBF signalling with a specific nSequence value (must be < 0xFFFFFFFE).
     */
    enableRbfWithSequence(nsequence: number): void;
    /**
     * Exclude UTXOs with fewer than min_confirms confirmations.
     */
    excludeBelowConfirmations(minConfirms: number): void;
    /**
     * Exclude all unconfirmed UTXOs.
     */
    excludeUnconfirmed(): void;
    /**
     * Set an absolute fee in satoshis (overrides fee_rate).
     */
    feeAbsolute(feeSats: bigint): void;
    /**
     * Set a fee rate target in sat/vbyte.
     */
    feeRate(satPerVbyte: number): void;
    /**
     * Build the transaction into a PSBT. The wallet is used for coin
     * selection and script resolution — the PSBT is NOT signed here.
     */
    finish(wallet: WalletInterface): PsbtInterface;
    /**
     * Include the redeemScript / witnessScript in PSBT outputs.
     */
    includeOutputRedeemWitnessScript(): void;
    /**
     * Only use the UTXOs explicitly added with add_utxo / add_utxos.
     */
    manuallySelectedOnly(): void;
    /**
     * Set an explicit nLockTime (as a block height).
     */
    nlocktime(lockHeight: number): void;
    /**
     * Only spend from change outputs.
     */
    onlySpendChange(): void;
    /**
     * Include only witness UTXO in PSBT inputs (reduced size, less validation).
     */
    onlyWitnessUtxo(): void;
    /**
     * Set the input/output ordering strategy.
     */
    ordering(ordering: TxOrdering): void;
    /**
     * Supply a policy path for complex descriptors (multisig, timelocks).
     * path_map is a JSON-encoded BTreeMap<String, Vec<usize>>.
     */
    policyPath(pathMapJson: string, keychain: KeychainKind): void;
    /**
     * Set an exact nSequence value for all inputs.
     */
    setExactSequence(nsequence: number): void;
    /**
     * Replace the entire recipient list.
     */
    setRecipients(recipients: Array<Recipient>): void;
    /**
     * Set the sighash type for all inputs.
     */
    sighash(sighashType: number): void;
    /**
     * Set the transaction version (1 or 2).
     */
    txVersion(version: number): void;
    /**
     * Mark UTXOs as unspendable (excluded from coin selection).
     */
    unspendable(outpoints: Array<OutPoint>): void;
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is TxBuilder;
}
export interface WalletInterface {
    /**
     * Broadcast a finalized PSBT via Electrum. Returns the txid.
     */
    broadcastWithElectrum(url: string, psbt: PsbtInterface): string;
    /**
     * Broadcast a finalized PSBT via Esplora. Returns the txid.
     */
    broadcastWithEsplora(url: string, psbt: PsbtInterface, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    /**
     * Build an RBF fee-bump PSBT for an unconfirmed transaction.
     * Mirrors Wallet::build_fee_bump().
     */
    buildFeeBump(txid: string, newFeeRate: number): PsbtInterface;
    /**
     * Calculate the fee paid by a raw transaction (hex). Returns satoshis.
     * Mirrors Wallet::calculate_fee().
     */
    calculateFee(txHex: string): bigint;
    /**
     * Calculate the fee rate for a raw transaction (hex). Returns sat/vbyte.
     * Mirrors Wallet::calculate_fee_rate().
     */
    calculateFeeRate(txHex: string): number;
    /**
     * Cancel (evict) a transaction from the wallet's view.
     * Mirrors Wallet::cancel_tx().
     */
    cancelTx(txHex: string): void;
    /**
     * All checkpoints in the local chain, ordered by height descending.
     * Mirrors Wallet::checkpoints().
     */
    checkpoints(): Array<BlockId>;
    /**
     * The highest derivation index that has been revealed, or null if none.
     * Mirrors Wallet::derivation_index().
     */
    derivationIndex(keychain: KeychainKind): /*u32*/ number | undefined;
    /**
     * Find the keychain and derivation index for a scriptPubKey (hex).
     * Returns null if the script does not belong to this wallet.
     * Mirrors Wallet::derivation_of_spk().
     */
    derivationOfSpk(scriptHex: string): DerivationInfo | undefined;
    /**
     * The descriptor checksum for the given keychain.
     * Mirrors Wallet::descriptor_checksum().
     */
    descriptorChecksum(keychain: KeychainKind): string;
    /**
     * Drain the entire wallet to an address. Returns txid.
     */
    drain(address: string, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    /**
     * Sign and attempt to finalize all inputs.
     * Returns true if fully finalized.
     * Mirrors Wallet::finalize_psbt() with default SignOptions.
     */
    finalizePsbt(psbt: PsbtInterface): boolean;
    /**
     * Full scan via an Electrum TCP/TLS server.
     */
    fullScanWithElectrum(url: string, stopGap: bigint): void;
    /**
     * Full scan via an Esplora HTTP server (discovers all used addresses).
     * Uses Wallet::start_full_scan() + bdk_esplora client internally.
     * stop_gap: how many consecutive unused addresses to scan before stopping.
     */
    fullScanWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    /**
     * Get the wallet balance. Mirrors Wallet::balance().
     */
    getBalance(): Balance;
    /**
     * Returns the raw transaction hex for a given txid. Null if not found.
     * Mirrors Wallet::get_tx().
     */
    getTx(txid: string): /*throws*/ string | undefined;
    /**
     * Get a specific UTXO. Returns null if not found. Mirrors Wallet::get_utxo().
     */
    getUtxo(outpoint: OutPoint): /*throws*/ LocalOutput | undefined;
    /**
     * Manually insert a TxOut (e.g. for tracking external outputs).
     * Mirrors Wallet::insert_txout().
     */
    insertTxout(outpoint: OutPoint, txout: TxOut): void;
    /**
     * Return true if the given scriptPubKey (hex) belongs to this wallet.
     * Mirrors Wallet::is_mine().
     */
    isMine(scriptHex: string): boolean;
    /**
     * List all keychains and their public descriptors.
     * Mirrors Wallet::keychains().
     */
    keychains(): Array<KeychainInfo>;
    /**
     * The latest checkpoint (tip of the local chain). Null if no blocks applied yet.
     * Mirrors Wallet::latest_checkpoint().
     */
    latestCheckpoint(): BlockId | undefined;
    /**
     * List all wallet outputs (spent and unspent). Mirrors Wallet::list_output().
     */
    listOutput(): Array<LocalOutput>;
    /**
     * List all unspent wallet outputs. Mirrors Wallet::list_unspent().
     */
    listUnspent(): Array<LocalOutput>;
    /**
     * List all addresses that have been revealed but not yet received funds.
     * Mirrors Wallet::list_unused_addresses().
     */
    listUnusedAddresses(keychain: KeychainKind): Array<AddressInfo>;
    /**
     * Mark an address index as used (returns true if previously unused).
     * Mirrors Wallet::mark_used().
     */
    markUsed(keychain: KeychainKind, index: number): boolean;
    /**
     * The network this wallet is configured for.
     * Mirrors Wallet::network().
     */
    network(): Network;
    /**
     * The next derivation index that will be revealed.
     * Mirrors Wallet::next_derivation_index().
     */
    nextDerivationIndex(keychain: KeychainKind): number;
    /**
     * Return the next address that has not yet received funds.
     * Mirrors Wallet::next_unused_address().
     */
    nextUnusedAddress(keychain: KeychainKind): AddressInfo;
    /**
     * Peek at a specific derivation index without advancing the counter.
     * Mirrors Wallet::peek_address().
     */
    peekAddress(keychain: KeychainKind, index: number): AddressInfo;
    /**
     * Persist any staged changes to the database.
     * Our FFI wraps PersistedWallet; this calls persist() internally.
     */
    persist(): boolean;
    /**
     * Spending policies for a given keychain, returned as a JSON string.
     * Returns null if the descriptor has no policy.
     * Mirrors Wallet::policies() — serialized because the Policy tree is complex.
     */
    policies(keychain: KeychainKind): /*throws*/ string | undefined;
    /**
     * The public-only descriptor for the given keychain as a string.
     * Mirrors Wallet::public_descriptor().
     */
    publicDescriptor(keychain: KeychainKind): string;
    /**
     * Reveal all addresses up to and including the given derivation index.
     * Mirrors Wallet::reveal_addresses_to().
     */
    revealAddressesTo(keychain: KeychainKind, index: number): Array<AddressInfo>;
    /**
     * Reveal and return the next address at the next derivation index,
     * incrementing the index even if previous addresses are unused.
     * Mirrors Wallet::reveal_next_address().
     */
    revealNextAddress(keychain: KeychainKind): AddressInfo;
    /**
     * Build, sign, and broadcast a simple payment in one call. Returns txid.
     * Combines build_tx → sign → broadcast via Esplora.
     */
    send(address: string, amountSats: bigint, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    /**
     * How much was sent from / received into the wallet for a raw tx (hex).
     * Mirrors Wallet::sent_and_received().
     */
    sentAndReceived(txHex: string): SentAndReceived;
    /**
     * Sign all inputs in the PSBT that this wallet can sign.
     * Returns true if the PSBT is fully finalized after signing.
     * Mirrors Wallet::sign() with default SignOptions.
     */
    sign(psbt: PsbtInterface): boolean;
    /**
     * Incremental sync via Electrum.
     */
    syncWithElectrum(url: string, stopGap: bigint): void;
    /**
     * Incremental sync via Esplora (only checks revealed SPKs + UTXOs + unconfirmed).
     * Uses Wallet::start_sync_with_revealed_spks() + bdk_esplora client internally.
     */
    syncWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    /**
     * All wallet-relevant canonical transactions.
     * Mirrors Wallet::transactions() → mapped to TxDetails.
     */
    transactions(): Array<TxDetails>;
    /**
     * Details for a single transaction. Returns null if not found.
     * Mirrors Wallet::tx_details().
     */
    txDetails(txid: string): /*throws*/ TxDetails | undefined;
    /**
     * Mark an address index as unused (returns true if previously used).
     * Mirrors Wallet::unmark_used().
     */
    unmarkUsed(keychain: KeychainKind, index: number): boolean;
}
export declare class Wallet extends UniffiAbstractObject implements WalletInterface {
    readonly [uniffiTypeNameSymbol] = "Wallet";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    /**
     * Create or load a persisted wallet.
     * descriptor / change_descriptor: output descriptor strings (e.g. "wpkh(tprv…/84'/1'/0'/0/*)")
     * db_path: file path for the SQLite persistence database.
     */
    constructor(descriptor: string, changeDescriptor: string, network: Network, dbPath: string);
    /**
     * Broadcast a finalized PSBT via Electrum. Returns the txid.
     */
    broadcastWithElectrum(url: string, psbt: PsbtInterface): string;
    /**
     * Broadcast a finalized PSBT via Esplora. Returns the txid.
     */
    broadcastWithEsplora(url: string, psbt: PsbtInterface, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    /**
     * Build an RBF fee-bump PSBT for an unconfirmed transaction.
     * Mirrors Wallet::build_fee_bump().
     */
    buildFeeBump(txid: string, newFeeRate: number): PsbtInterface;
    /**
     * Calculate the fee paid by a raw transaction (hex). Returns satoshis.
     * Mirrors Wallet::calculate_fee().
     */
    calculateFee(txHex: string): bigint;
    /**
     * Calculate the fee rate for a raw transaction (hex). Returns sat/vbyte.
     * Mirrors Wallet::calculate_fee_rate().
     */
    calculateFeeRate(txHex: string): number;
    /**
     * Cancel (evict) a transaction from the wallet's view.
     * Mirrors Wallet::cancel_tx().
     */
    cancelTx(txHex: string): void;
    /**
     * All checkpoints in the local chain, ordered by height descending.
     * Mirrors Wallet::checkpoints().
     */
    checkpoints(): Array<BlockId>;
    /**
     * The highest derivation index that has been revealed, or null if none.
     * Mirrors Wallet::derivation_index().
     */
    derivationIndex(keychain: KeychainKind): /*u32*/ number | undefined;
    /**
     * Find the keychain and derivation index for a scriptPubKey (hex).
     * Returns null if the script does not belong to this wallet.
     * Mirrors Wallet::derivation_of_spk().
     */
    derivationOfSpk(scriptHex: string): DerivationInfo | undefined;
    /**
     * The descriptor checksum for the given keychain.
     * Mirrors Wallet::descriptor_checksum().
     */
    descriptorChecksum(keychain: KeychainKind): string;
    /**
     * Drain the entire wallet to an address. Returns txid.
     */
    drain(address: string, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    /**
     * Sign and attempt to finalize all inputs.
     * Returns true if fully finalized.
     * Mirrors Wallet::finalize_psbt() with default SignOptions.
     */
    finalizePsbt(psbt: PsbtInterface): boolean;
    /**
     * Full scan via an Electrum TCP/TLS server.
     */
    fullScanWithElectrum(url: string, stopGap: bigint): void;
    /**
     * Full scan via an Esplora HTTP server (discovers all used addresses).
     * Uses Wallet::start_full_scan() + bdk_esplora client internally.
     * stop_gap: how many consecutive unused addresses to scan before stopping.
     */
    fullScanWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    /**
     * Get the wallet balance. Mirrors Wallet::balance().
     */
    getBalance(): Balance;
    /**
     * Returns the raw transaction hex for a given txid. Null if not found.
     * Mirrors Wallet::get_tx().
     */
    getTx(txid: string): string | undefined;
    /**
     * Get a specific UTXO. Returns null if not found. Mirrors Wallet::get_utxo().
     */
    getUtxo(outpoint: OutPoint): LocalOutput | undefined;
    /**
     * Manually insert a TxOut (e.g. for tracking external outputs).
     * Mirrors Wallet::insert_txout().
     */
    insertTxout(outpoint: OutPoint, txout: TxOut): void;
    /**
     * Return true if the given scriptPubKey (hex) belongs to this wallet.
     * Mirrors Wallet::is_mine().
     */
    isMine(scriptHex: string): boolean;
    /**
     * List all keychains and their public descriptors.
     * Mirrors Wallet::keychains().
     */
    keychains(): Array<KeychainInfo>;
    /**
     * The latest checkpoint (tip of the local chain). Null if no blocks applied yet.
     * Mirrors Wallet::latest_checkpoint().
     */
    latestCheckpoint(): BlockId | undefined;
    /**
     * List all wallet outputs (spent and unspent). Mirrors Wallet::list_output().
     */
    listOutput(): Array<LocalOutput>;
    /**
     * List all unspent wallet outputs. Mirrors Wallet::list_unspent().
     */
    listUnspent(): Array<LocalOutput>;
    /**
     * List all addresses that have been revealed but not yet received funds.
     * Mirrors Wallet::list_unused_addresses().
     */
    listUnusedAddresses(keychain: KeychainKind): Array<AddressInfo>;
    /**
     * Mark an address index as used (returns true if previously unused).
     * Mirrors Wallet::mark_used().
     */
    markUsed(keychain: KeychainKind, index: number): boolean;
    /**
     * The network this wallet is configured for.
     * Mirrors Wallet::network().
     */
    network(): Network;
    /**
     * The next derivation index that will be revealed.
     * Mirrors Wallet::next_derivation_index().
     */
    nextDerivationIndex(keychain: KeychainKind): number;
    /**
     * Return the next address that has not yet received funds.
     * Mirrors Wallet::next_unused_address().
     */
    nextUnusedAddress(keychain: KeychainKind): AddressInfo;
    /**
     * Peek at a specific derivation index without advancing the counter.
     * Mirrors Wallet::peek_address().
     */
    peekAddress(keychain: KeychainKind, index: number): AddressInfo;
    /**
     * Persist any staged changes to the database.
     * Our FFI wraps PersistedWallet; this calls persist() internally.
     */
    persist(): boolean;
    /**
     * Spending policies for a given keychain, returned as a JSON string.
     * Returns null if the descriptor has no policy.
     * Mirrors Wallet::policies() — serialized because the Policy tree is complex.
     */
    policies(keychain: KeychainKind): string | undefined;
    /**
     * The public-only descriptor for the given keychain as a string.
     * Mirrors Wallet::public_descriptor().
     */
    publicDescriptor(keychain: KeychainKind): string;
    /**
     * Reveal all addresses up to and including the given derivation index.
     * Mirrors Wallet::reveal_addresses_to().
     */
    revealAddressesTo(keychain: KeychainKind, index: number): Array<AddressInfo>;
    /**
     * Reveal and return the next address at the next derivation index,
     * incrementing the index even if previous addresses are unused.
     * Mirrors Wallet::reveal_next_address().
     */
    revealNextAddress(keychain: KeychainKind): AddressInfo;
    /**
     * Build, sign, and broadcast a simple payment in one call. Returns txid.
     * Combines build_tx → sign → broadcast via Esplora.
     */
    send(address: string, amountSats: bigint, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    /**
     * How much was sent from / received into the wallet for a raw tx (hex).
     * Mirrors Wallet::sent_and_received().
     */
    sentAndReceived(txHex: string): SentAndReceived;
    /**
     * Sign all inputs in the PSBT that this wallet can sign.
     * Returns true if the PSBT is fully finalized after signing.
     * Mirrors Wallet::sign() with default SignOptions.
     */
    sign(psbt: PsbtInterface): boolean;
    /**
     * Incremental sync via Electrum.
     */
    syncWithElectrum(url: string, stopGap: bigint): void;
    /**
     * Incremental sync via Esplora (only checks revealed SPKs + UTXOs + unconfirmed).
     * Uses Wallet::start_sync_with_revealed_spks() + bdk_esplora client internally.
     */
    syncWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    /**
     * All wallet-relevant canonical transactions.
     * Mirrors Wallet::transactions() → mapped to TxDetails.
     */
    transactions(): Array<TxDetails>;
    /**
     * Details for a single transaction. Returns null if not found.
     * Mirrors Wallet::tx_details().
     */
    txDetails(txid: string): TxDetails | undefined;
    /**
     * Mark an address index as unused (returns true if previously used).
     * Mirrors Wallet::unmark_used().
     */
    unmarkUsed(keychain: KeychainKind, index: number): boolean;
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is Wallet;
}
/**
 * This should be called before anything else.
 *
 * It is likely that this is being done for you by the library's `index.ts`.
 *
 * It checks versions of uniffi between when the Rust scaffolding was generated
 * and when the bindings were generated.
 *
 * It also initializes the machinery to enable Rust to talk back to Javascript.
 */
declare function uniffiEnsureInitialized(): void;
declare const _default: Readonly<{
    initialize: typeof uniffiEnsureInitialized;
    converters: {
        FfiConverterTypeAddressInfo: {
            read(from: RustBuffer): AddressInfo;
            write(value: AddressInfo, into: RustBuffer): void;
            allocationSize(value: AddressInfo): number;
            lift(value: UniffiByteArray): AddressInfo;
            lower(value: AddressInfo): UniffiByteArray;
        };
        FfiConverterTypeBalance: {
            read(from: RustBuffer): Balance;
            write(value: Balance, into: RustBuffer): void;
            allocationSize(value: Balance): number;
            lift(value: UniffiByteArray): Balance;
            lower(value: Balance): UniffiByteArray;
        };
        FfiConverterTypeBdkError: {
            read(from: RustBuffer): BdkError;
            write(value: BdkError, into: RustBuffer): void;
            allocationSize(value: BdkError): number;
            lift(value: UniffiByteArray): BdkError;
            lower(value: BdkError): UniffiByteArray;
        };
        FfiConverterTypeBlockId: {
            read(from: RustBuffer): BlockId;
            write(value: BlockId, into: RustBuffer): void;
            allocationSize(value: BlockId): number;
            lift(value: UniffiByteArray): BlockId;
            lower(value: BlockId): UniffiByteArray;
        };
        FfiConverterTypeChangeSpendPolicy: {
            read(from: RustBuffer): ChangeSpendPolicy;
            write(value: ChangeSpendPolicy, into: RustBuffer): void;
            allocationSize(value: ChangeSpendPolicy): number;
            lift(value: UniffiByteArray): ChangeSpendPolicy;
            lower(value: ChangeSpendPolicy): UniffiByteArray;
        };
        FfiConverterTypeConfirmationBlockTime: {
            read(from: RustBuffer): ConfirmationBlockTime;
            write(value: ConfirmationBlockTime, into: RustBuffer): void;
            allocationSize(value: ConfirmationBlockTime): number;
            lift(value: UniffiByteArray): ConfirmationBlockTime;
            lower(value: ConfirmationBlockTime): UniffiByteArray;
        };
        FfiConverterTypeDerivationInfo: {
            read(from: RustBuffer): DerivationInfo;
            write(value: DerivationInfo, into: RustBuffer): void;
            allocationSize(value: DerivationInfo): number;
            lift(value: UniffiByteArray): DerivationInfo;
            lower(value: DerivationInfo): UniffiByteArray;
        };
        FfiConverterTypeDescriptorTemplate: {
            read(from: RustBuffer): DescriptorTemplate;
            write(value: DescriptorTemplate, into: RustBuffer): void;
            allocationSize(value: DescriptorTemplate): number;
            lift(value: UniffiByteArray): DescriptorTemplate;
            lower(value: DescriptorTemplate): UniffiByteArray;
        };
        FfiConverterTypeKeychainInfo: {
            read(from: RustBuffer): KeychainInfo;
            write(value: KeychainInfo, into: RustBuffer): void;
            allocationSize(value: KeychainInfo): number;
            lift(value: UniffiByteArray): KeychainInfo;
            lower(value: KeychainInfo): UniffiByteArray;
        };
        FfiConverterTypeKeychainKind: {
            read(from: RustBuffer): KeychainKind;
            write(value: KeychainKind, into: RustBuffer): void;
            allocationSize(value: KeychainKind): number;
            lift(value: UniffiByteArray): KeychainKind;
            lower(value: KeychainKind): UniffiByteArray;
        };
        FfiConverterTypeLanguage: {
            read(from: RustBuffer): Language;
            write(value: Language, into: RustBuffer): void;
            allocationSize(value: Language): number;
            lift(value: UniffiByteArray): Language;
            lower(value: Language): UniffiByteArray;
        };
        FfiConverterTypeLocalOutput: {
            read(from: RustBuffer): LocalOutput;
            write(value: LocalOutput, into: RustBuffer): void;
            allocationSize(value: LocalOutput): number;
            lift(value: UniffiByteArray): LocalOutput;
            lower(value: LocalOutput): UniffiByteArray;
        };
        FfiConverterTypeMnemonic: FfiConverterObject<MnemonicInterface>;
        FfiConverterTypeNetwork: {
            read(from: RustBuffer): Network;
            write(value: Network, into: RustBuffer): void;
            allocationSize(value: Network): number;
            lift(value: UniffiByteArray): Network;
            lower(value: Network): UniffiByteArray;
        };
        FfiConverterTypeOutPoint: {
            read(from: RustBuffer): OutPoint;
            write(value: OutPoint, into: RustBuffer): void;
            allocationSize(value: OutPoint): number;
            lift(value: UniffiByteArray): OutPoint;
            lower(value: OutPoint): UniffiByteArray;
        };
        FfiConverterTypePsbt: FfiConverterObject<PsbtInterface>;
        FfiConverterTypeRecipient: {
            read(from: RustBuffer): Recipient;
            write(value: Recipient, into: RustBuffer): void;
            allocationSize(value: Recipient): number;
            lift(value: UniffiByteArray): Recipient;
            lower(value: Recipient): UniffiByteArray;
        };
        FfiConverterTypeSentAndReceived: {
            read(from: RustBuffer): SentAndReceived;
            write(value: SentAndReceived, into: RustBuffer): void;
            allocationSize(value: SentAndReceived): number;
            lift(value: UniffiByteArray): SentAndReceived;
            lower(value: SentAndReceived): UniffiByteArray;
        };
        FfiConverterTypeSingleKeyDescriptorTemplate: {
            read(from: RustBuffer): SingleKeyDescriptorTemplate;
            write(value: SingleKeyDescriptorTemplate, into: RustBuffer): void;
            allocationSize(value: SingleKeyDescriptorTemplate): number;
            lift(value: UniffiByteArray): SingleKeyDescriptorTemplate;
            lower(value: SingleKeyDescriptorTemplate): UniffiByteArray;
        };
        FfiConverterTypeTxBuilder: FfiConverterObject<TxBuilderInterface>;
        FfiConverterTypeTxDetails: {
            read(from: RustBuffer): TxDetails;
            write(value: TxDetails, into: RustBuffer): void;
            allocationSize(value: TxDetails): number;
            lift(value: UniffiByteArray): TxDetails;
            lower(value: TxDetails): UniffiByteArray;
        };
        FfiConverterTypeTxOrdering: {
            read(from: RustBuffer): TxOrdering;
            write(value: TxOrdering, into: RustBuffer): void;
            allocationSize(value: TxOrdering): number;
            lift(value: UniffiByteArray): TxOrdering;
            lower(value: TxOrdering): UniffiByteArray;
        };
        FfiConverterTypeTxOut: {
            read(from: RustBuffer): TxOut;
            write(value: TxOut, into: RustBuffer): void;
            allocationSize(value: TxOut): number;
            lift(value: UniffiByteArray): TxOut;
            lower(value: TxOut): UniffiByteArray;
        };
        FfiConverterTypeWallet: FfiConverterObject<WalletInterface>;
        FfiConverterTypeWalletEvent: {
            read(from: RustBuffer): WalletEvent;
            write(value: WalletEvent, into: RustBuffer): void;
            allocationSize(value: WalletEvent): number;
            lift(value: UniffiByteArray): WalletEvent;
            lower(value: WalletEvent): UniffiByteArray;
        };
        FfiConverterTypeWordCount: {
            read(from: RustBuffer): WordCount;
            write(value: WordCount, into: RustBuffer): void;
            allocationSize(value: WordCount): number;
            lift(value: UniffiByteArray): WordCount;
            lower(value: WordCount): UniffiByteArray;
        };
    };
}>;
export default _default;
//# sourceMappingURL=bdk_ffi.d.ts.map