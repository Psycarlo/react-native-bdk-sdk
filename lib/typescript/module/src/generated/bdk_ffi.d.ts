import { type UniffiByteArray, type UniffiGcObject, type UniffiHandle, FfiConverterObject, RustBuffer, UniffiAbstractObject, destructorGuardSymbol, pointerLiteralSymbol, uniffiTypeNameSymbol } from "uniffi-bindgen-react-native";
/**
 * Convert a scriptPubKey (hex) to an address string for the given network.
 * Returns the address string, or an error if the script cannot be converted.
 */
export declare function addressFromScript(scriptHex: string, network: Network): string;
/**
 * Generate an output descriptor string from a mnemonic using a standard BIP template.
 */
export declare function createDescriptor(mnemonic: MnemonicLike, template: DescriptorTemplate, keychain: KeychainKind, network: Network): string;
/**
 * Generate an output descriptor from a mnemonic string (convenience overload).
 */
export declare function createDescriptorFromString(mnemonic: string, template: DescriptorTemplate, keychain: KeychainKind, network: Network): string;
/**
 * Generate a public (watch-only) descriptor from an xpub string.
 */
export declare function createPublicDescriptor(xpub: string, template: DescriptorTemplate, keychain: KeychainKind, network: Network): string;
/**
 * Generate a single-key descriptor from a key string.
 */
export declare function createSingleKeyDescriptor(key: string, template: SingleKeyDescriptorTemplate, network: Network): string;
/**
 * Async wallet factory — creates or loads a wallet without blocking the JS thread.
 * Pass null/undefined for change_descriptor to use the main descriptor for both keychains.
 */
export declare function createWallet(descriptor: string, changeDescriptor: string | undefined, network: Network, dbPath: string, asyncOpts_?: {
    signal: AbortSignal;
}): Promise<WalletLike>;
/**
 * Export a wallet in FullyNoded-compatible JSON format for backup.
 */
export declare function exportWallet(wallet: WalletLike, label: string, includeBlockHeight: boolean): string;
/**
 * Returns true if the address string is valid for the given network.
 */
export declare function isValidAddress(address: string, network: Network): boolean;
/**
 * Validate a descriptor string for the given network without creating a wallet.
 */
export declare function validateDescriptor(descriptor: string, network: Network): boolean;
/**
 * Runtime version of the bdk_wallet crate.
 */
export declare function version(): string;
/**
 * Compute a deterministic wallet name from its descriptors.
 */
export declare function walletNameFromDescriptor(descriptor: string, changeDescriptor: string | undefined, network: Network): string;
export type AddressInfo = {
    index: number;
    address: string;
    keychain: KeychainKind;
};
/**
 * Generated factory for {@link AddressInfo} record objects.
 */
export declare const AddressInfo: Readonly<{
    create: (partial: Partial<AddressInfo> & Required<Omit<AddressInfo, never>>) => AddressInfo;
    new: (partial: Partial<AddressInfo> & Required<Omit<AddressInfo, never>>) => AddressInfo;
    defaults: () => Partial<AddressInfo>;
}>;
export type Balance = {
    immature: bigint;
    trustedPending: bigint;
    untrustedPending: bigint;
    confirmed: bigint;
    trustedSpendable: bigint;
    total: bigint;
};
/**
 * Generated factory for {@link Balance} record objects.
 */
export declare const Balance: Readonly<{
    create: (partial: Partial<Balance> & Required<Omit<Balance, never>>) => Balance;
    new: (partial: Partial<Balance> & Required<Omit<Balance, never>>) => Balance;
    defaults: () => Partial<Balance>;
}>;
export type BlockId = {
    height: number;
    hash: string;
};
/**
 * Generated factory for {@link BlockId} record objects.
 */
export declare const BlockId: Readonly<{
    create: (partial: Partial<BlockId> & Required<Omit<BlockId, never>>) => BlockId;
    new: (partial: Partial<BlockId> & Required<Omit<BlockId, never>>) => BlockId;
    defaults: () => Partial<BlockId>;
}>;
export type ConfirmationBlockTime = {
    height: number;
    blockHash: string;
    timestamp: bigint;
};
/**
 * Generated factory for {@link ConfirmationBlockTime} record objects.
 */
export declare const ConfirmationBlockTime: Readonly<{
    create: (partial: Partial<ConfirmationBlockTime> & Required<Omit<ConfirmationBlockTime, never>>) => ConfirmationBlockTime;
    new: (partial: Partial<ConfirmationBlockTime> & Required<Omit<ConfirmationBlockTime, never>>) => ConfirmationBlockTime;
    defaults: () => Partial<ConfirmationBlockTime>;
}>;
export type DerivationInfo = {
    keychain: KeychainKind;
    index: number;
};
/**
 * Generated factory for {@link DerivationInfo} record objects.
 */
export declare const DerivationInfo: Readonly<{
    create: (partial: Partial<DerivationInfo> & Required<Omit<DerivationInfo, never>>) => DerivationInfo;
    new: (partial: Partial<DerivationInfo> & Required<Omit<DerivationInfo, never>>) => DerivationInfo;
    defaults: () => Partial<DerivationInfo>;
}>;
export type KeychainInfo = {
    keychain: KeychainKind;
    descriptor: string;
};
/**
 * Generated factory for {@link KeychainInfo} record objects.
 */
export declare const KeychainInfo: Readonly<{
    create: (partial: Partial<KeychainInfo> & Required<Omit<KeychainInfo, never>>) => KeychainInfo;
    new: (partial: Partial<KeychainInfo> & Required<Omit<KeychainInfo, never>>) => KeychainInfo;
    defaults: () => Partial<KeychainInfo>;
}>;
export type LocalOutput = {
    outpoint: OutPoint;
    txout: TxOut;
    keychain: KeychainKind;
    isSpent: boolean;
    derivationIndex: number;
    confirmationBlockTime?: ConfirmationBlockTime;
};
/**
 * Generated factory for {@link LocalOutput} record objects.
 */
export declare const LocalOutput: Readonly<{
    create: (partial: Partial<LocalOutput> & Required<Omit<LocalOutput, "confirmationBlockTime">>) => LocalOutput;
    new: (partial: Partial<LocalOutput> & Required<Omit<LocalOutput, "confirmationBlockTime">>) => LocalOutput;
    defaults: () => Partial<LocalOutput>;
}>;
export type OutPoint = {
    txid: string;
    vout: number;
};
/**
 * Generated factory for {@link OutPoint} record objects.
 */
export declare const OutPoint: Readonly<{
    create: (partial: Partial<OutPoint> & Required<Omit<OutPoint, never>>) => OutPoint;
    new: (partial: Partial<OutPoint> & Required<Omit<OutPoint, never>>) => OutPoint;
    defaults: () => Partial<OutPoint>;
}>;
export type Recipient = {
    address: string;
    amountSats: bigint;
};
/**
 * Generated factory for {@link Recipient} record objects.
 */
export declare const Recipient: Readonly<{
    create: (partial: Partial<Recipient> & Required<Omit<Recipient, never>>) => Recipient;
    new: (partial: Partial<Recipient> & Required<Omit<Recipient, never>>) => Recipient;
    defaults: () => Partial<Recipient>;
}>;
export type SentAndReceived = {
    sent: bigint;
    received: bigint;
};
/**
 * Generated factory for {@link SentAndReceived} record objects.
 */
export declare const SentAndReceived: Readonly<{
    create: (partial: Partial<SentAndReceived> & Required<Omit<SentAndReceived, never>>) => SentAndReceived;
    new: (partial: Partial<SentAndReceived> & Required<Omit<SentAndReceived, never>>) => SentAndReceived;
    defaults: () => Partial<SentAndReceived>;
}>;
export type TxDetails = {
    txid: string;
    sent: bigint;
    received: bigint;
    fee?: bigint;
    feeRate?: number;
    balanceDelta: bigint;
    confirmationBlockTime?: ConfirmationBlockTime;
    txHex: string;
    version: number;
    locktime: number;
    inputs: Array<TxInput>;
    outputs: Array<TxOutput>;
};
/**
 * Generated factory for {@link TxDetails} record objects.
 */
export declare const TxDetails: Readonly<{
    create: (partial: Partial<TxDetails> & Required<Omit<TxDetails, "confirmationBlockTime" | "fee" | "feeRate">>) => TxDetails;
    new: (partial: Partial<TxDetails> & Required<Omit<TxDetails, "confirmationBlockTime" | "fee" | "feeRate">>) => TxDetails;
    defaults: () => Partial<TxDetails>;
}>;
export type TxInput = {
    previousTxid: string;
    previousVout: number;
    sequence: number;
    scriptSigHex: string;
    witness: Array<string>;
};
/**
 * Generated factory for {@link TxInput} record objects.
 */
export declare const TxInput: Readonly<{
    create: (partial: Partial<TxInput> & Required<Omit<TxInput, never>>) => TxInput;
    new: (partial: Partial<TxInput> & Required<Omit<TxInput, never>>) => TxInput;
    defaults: () => Partial<TxInput>;
}>;
export type TxOut = {
    value: bigint;
    scriptPubkeyHex: string;
};
/**
 * Generated factory for {@link TxOut} record objects.
 */
export declare const TxOut: Readonly<{
    create: (partial: Partial<TxOut> & Required<Omit<TxOut, never>>) => TxOut;
    new: (partial: Partial<TxOut> & Required<Omit<TxOut, never>>) => TxOut;
    defaults: () => Partial<TxOut>;
}>;
export type TxOutput = {
    value: bigint;
    scriptPubkeyHex: string;
    address?: string;
};
/**
 * Generated factory for {@link TxOutput} record objects.
 */
export declare const TxOutput: Readonly<{
    create: (partial: Partial<TxOutput> & Required<Omit<TxOutput, "address">>) => TxOutput;
    new: (partial: Partial<TxOutput> & Required<Omit<TxOutput, "address">>) => TxOutput;
    defaults: () => Partial<TxOutput>;
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
export declare const BdkError: Readonly<{
    instanceOf: (obj: any) => obj is BdkError;
    InvalidDescriptor: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidDescriptor;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    WalletCreationFailed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.WalletCreationFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    WalletLoadFailed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.WalletLoadFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    WalletLoadMismatch: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.WalletLoadMismatch;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    PersistError: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.PersistError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.PersistError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.PersistError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.PersistError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.PersistError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidAddress: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidAddress;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidAddress;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidAddress;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidAddress;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidAddress;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidScript: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    TransactionBuildFailed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.TransactionBuildFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    NoRecipients: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.NoRecipients;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.NoRecipients;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.NoRecipients;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.NoRecipients;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.NoRecipients;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    NoUtxosSelected: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.NoUtxosSelected;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    OutputBelowDustLimit: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.OutputBelowDustLimit;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InsufficientFunds: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InsufficientFunds;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InsufficientFunds;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InsufficientFunds;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InsufficientFunds;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InsufficientFunds;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeRateTooLow: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeRateTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeTooLow: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeTooLow;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    LockTimeConflict: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.LockTimeConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.LockTimeConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.LockTimeConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.LockTimeConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.LockTimeConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    RbfSequenceConflict: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.RbfSequenceConflict;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    VersionZero: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.VersionZero;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.VersionZero;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.VersionZero;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.VersionZero;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.VersionZero;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    VersionOneCsv: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.VersionOneCsv;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.VersionOneCsv;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.VersionOneCsv;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.VersionOneCsv;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.VersionOneCsv;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SpendingPolicyRequired: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SpendingPolicyRequired;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    MissingKeyOrigin: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.MissingKeyOrigin;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    MissingNonWitnessUtxo: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.MissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    OutpointNotFound: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.OutpointNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.OutpointNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.OutpointNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.OutpointNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.OutpointNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpTargetNotFound: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeBumpTargetNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpAlreadyConfirmed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeBumpAlreadyConfirmed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpIrreplaceable: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeBumpIrreplaceable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpFeeRateUnavailable: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeBumpFeeRateUnavailable;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    FeeBumpInvalidOutputIndex: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.FeeBumpInvalidOutputIndex;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidPsbt: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidPsbt;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidPsbt;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidPsbt;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidPsbt;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidPsbt;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignFailed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingKey: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerMissingKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerInvalidKey: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerInvalidKey;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerUserCanceled: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerUserCanceled;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerInputIndexOutOfRange: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerInputIndexOutOfRange;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingNonWitnessUtxo: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerMissingNonWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingWitnessUtxo: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerMissingWitnessUtxo;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerMissingWitnessScript: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerMissingWitnessScript;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerNonStandardSighash: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerNonStandardSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SignerInvalidSighash: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SignerInvalidSighash;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    SyncFailed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SyncFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.SyncFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.SyncFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.SyncFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.SyncFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    BroadcastFailed: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.BroadcastFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.BroadcastFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.BroadcastFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.BroadcastFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.BroadcastFailed;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidTransaction: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidTransaction;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidTransaction;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidTransaction;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidTransaction;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidTransaction;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    TransactionNotFound: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.TransactionNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.TransactionNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.TransactionNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.TransactionNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.TransactionNotFound;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    CannotConnect: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.CannotConnect;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.CannotConnect;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.CannotConnect;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.CannotConnect;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.CannotConnect;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    CalculateFeeError: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.CalculateFeeError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.CalculateFeeError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.CalculateFeeError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.CalculateFeeError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.CalculateFeeError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidMnemonic: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidMnemonic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    InvalidEntropy: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidEntropy;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.InvalidEntropy;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidEntropy;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.InvalidEntropy;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.InvalidEntropy;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    KeyError: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.KeyError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.KeyError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.KeyError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.KeyError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.KeyError;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    Generic: {
        new (inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.Generic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        "new"(inner: {
            message: string;
        }): {
            readonly tag: BdkError_Tags.Generic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        instanceOf(obj: any): obj is {
            readonly tag: BdkError_Tags.Generic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        hasInner(obj: any): obj is {
            readonly tag: BdkError_Tags.Generic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        };
        getInner(obj: {
            readonly tag: BdkError_Tags.Generic;
            readonly inner: Readonly<{
                message: string;
            }>;
            /**
             * @private
             * This field is private and should not be used, use `tag` instead.
             */
            readonly [uniffiTypeNameSymbol]: "BdkError";
            name: string;
            message: string;
            stack?: string;
            cause?: unknown;
        }): Readonly<{
            message: string;
        }>;
        isError(error: unknown): error is Error;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
}>;
export type BdkError = InstanceType<(typeof BdkError)[keyof Omit<typeof BdkError, "instanceOf">]>;
export declare enum ChangeSpendPolicy {
    ChangeAllowed = 0,
    OnlyChange = 1,
    ChangeForbidden = 2
}
export declare enum DescriptorTemplate {
    Bip44 = 0,
    Bip49 = 1,
    Bip84 = 2,
    Bip86 = 3
}
export declare enum KeychainKind {
    External = 0,
    Internal = 1
}
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
export declare enum SingleKeyDescriptorTemplate {
    P2Pkh = 0,
    P2Wpkh = 1,
    P2WpkhP2Sh = 2,
    P2tr = 3
}
export declare enum TxOrdering {
    Shuffle = 0,
    Untouched = 1
}
export declare enum WordCount {
    Words12 = 0,
    Words15 = 1,
    Words18 = 2,
    Words21 = 3,
    Words24 = 4
}
/**
 * A reusable Electrum client that holds a persistent TCP/TLS connection.
 * Create once, pass to multiple wallet methods to avoid reconnecting each time.
 */
export interface ElectrumClientLike {
}
/**
 * @deprecated Use `ElectrumClientLike` instead.
 */
export type ElectrumClientInterface = ElectrumClientLike;
/**
 * A reusable Electrum client that holds a persistent TCP/TLS connection.
 * Create once, pass to multiple wallet methods to avoid reconnecting each time.
 */
export declare class ElectrumClient extends UniffiAbstractObject implements ElectrumClientLike {
    readonly [uniffiTypeNameSymbol] = "ElectrumClient";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    /**
     * Connect to an Electrum server.
     * url: e.g. "ssl://electrum.blockstream.info:60002" or "tcp://localhost:50001"
     */
    constructor(url: string);
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is ElectrumClient;
}
export interface MnemonicLike {
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
 * @deprecated Use `MnemonicLike` instead.
 */
export type MnemonicInterface = MnemonicLike;
export declare class Mnemonic extends UniffiAbstractObject implements MnemonicLike {
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
    static fromEntropy(entropy: ArrayBuffer): MnemonicLike;
    /**
     * Create a mnemonic from raw entropy bytes in a specific language.
     */
    static fromEntropyIn(entropy: ArrayBuffer, language: Language): MnemonicLike;
    /**
     * Parse an existing mnemonic string (auto-detects language).
     */
    static fromString(mnemonic: string): MnemonicLike;
    /**
     * Parse a mnemonic string in a specific language.
     */
    static fromStringIn(mnemonic: string, language: Language): MnemonicLike;
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
export interface PsbtLike {
    /**
     * Extract the fully-signed transaction as raw hex.
     */
    extractTxHex(): string;
    /**
     * Total fee in satoshis. None if any input UTXO value is unknown.
     */
    feeAmount(): /*u64*/ bigint | undefined;
    /**
     * Fee rate in sat/vbyte. None if any input UTXO value is unknown.
     */
    feeRate(): /*f64*/ number | undefined;
    /**
     * Retrieve the UTXO for a given input index. Returns None if unavailable.
     */
    getUtxoFor(inputIndex: bigint): TxOut | undefined;
    /**
     * Serialize to a base64-encoded string.
     */
    toBase64(): string;
    /**
     * The unsigned txid.
     */
    txid(): string;
}
/**
 * @deprecated Use `PsbtLike` instead.
 */
export type PsbtInterface = PsbtLike;
export declare class Psbt extends UniffiAbstractObject implements PsbtLike {
    readonly [uniffiTypeNameSymbol] = "Psbt";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    /**
     * Deserialize from a base64-encoded string.
     */
    constructor(psbtBase64: string);
    /**
     * Extract the fully-signed transaction as raw hex.
     */
    extractTxHex(): string;
    /**
     * Total fee in satoshis. None if any input UTXO value is unknown.
     */
    feeAmount(): /*u64*/ bigint | undefined;
    /**
     * Fee rate in sat/vbyte. None if any input UTXO value is unknown.
     */
    feeRate(): /*f64*/ number | undefined;
    /**
     * Retrieve the UTXO for a given input index. Returns None if unavailable.
     */
    getUtxoFor(inputIndex: bigint): TxOut | undefined;
    /**
     * Serialize to a base64-encoded string.
     */
    toBase64(): string;
    /**
     * The unsigned txid.
     */
    txid(): string;
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is Psbt;
}
export interface TxBuilderLike {
    addData(data: ArrayBuffer): void;
    addGlobalXpubs(): void;
    addRecipient(address: string, amountSats: bigint): void;
    addUnspendable(outpoint: OutPoint): void;
    addUtxo(outpoint: OutPoint): void;
    addUtxos(outpoints: Array<OutPoint>): void;
    allowDust(allow: boolean): void;
    changePolicy(policy: ChangeSpendPolicy): void;
    currentHeight(height: number): void;
    doNotSpendChange(): void;
    drainTo(address: string): void;
    drainWallet(): void;
    enableRbf(): void;
    enableRbfWithSequence(nsequence: number): void;
    excludeBelowConfirmations(minConfirms: number): void;
    excludeUnconfirmed(): void;
    feeAbsolute(feeSats: bigint): void;
    feeRate(satPerVbyte: number): void;
    /**
     * Build the transaction into a PSBT using the wallet.
     * Runs on a background thread to avoid blocking the JS thread.
     */
    finish(wallet: WalletLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<PsbtLike>;
    manuallySelectedOnly(): void;
    nlocktime(lockHeight: number): void;
    onlySpendChange(): void;
    onlyWitnessUtxo(): void;
    ordering(ordering: TxOrdering): void;
    policyPath(pathMapJson: string, keychain: KeychainKind): void;
    setExactSequence(nsequence: number): void;
    setRecipients(recipients: Array<Recipient>): void;
    sighash(sighashType: number): void;
    txVersion(version: number): void;
    unspendable(outpoints: Array<OutPoint>): void;
}
/**
 * @deprecated Use `TxBuilderLike` instead.
 */
export type TxBuilderInterface = TxBuilderLike;
export declare class TxBuilder extends UniffiAbstractObject implements TxBuilderLike {
    readonly [uniffiTypeNameSymbol] = "TxBuilder";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    constructor();
    addData(data: ArrayBuffer): void;
    addGlobalXpubs(): void;
    addRecipient(address: string, amountSats: bigint): void;
    addUnspendable(outpoint: OutPoint): void;
    addUtxo(outpoint: OutPoint): void;
    addUtxos(outpoints: Array<OutPoint>): void;
    allowDust(allow: boolean): void;
    changePolicy(policy: ChangeSpendPolicy): void;
    currentHeight(height: number): void;
    doNotSpendChange(): void;
    drainTo(address: string): void;
    drainWallet(): void;
    enableRbf(): void;
    enableRbfWithSequence(nsequence: number): void;
    excludeBelowConfirmations(minConfirms: number): void;
    excludeUnconfirmed(): void;
    feeAbsolute(feeSats: bigint): void;
    feeRate(satPerVbyte: number): void;
    /**
     * Build the transaction into a PSBT using the wallet.
     * Runs on a background thread to avoid blocking the JS thread.
     */
    finish(wallet: WalletLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<PsbtLike>;
    manuallySelectedOnly(): void;
    nlocktime(lockHeight: number): void;
    onlySpendChange(): void;
    onlyWitnessUtxo(): void;
    ordering(ordering: TxOrdering): void;
    policyPath(pathMapJson: string, keychain: KeychainKind): void;
    setExactSequence(nsequence: number): void;
    setRecipients(recipients: Array<Recipient>): void;
    sighash(sighashType: number): void;
    txVersion(version: number): void;
    unspendable(outpoints: Array<OutPoint>): void;
    /**
     * {@inheritDoc uniffi-bindgen-react-native#UniffiAbstractObject.uniffiDestroy}
     */
    uniffiDestroy(): void;
    static instanceOf(obj: any): obj is TxBuilder;
}
export interface WalletLike {
    broadcastWithElectrum(client: ElectrumClientLike, psbt: PsbtLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    broadcastWithEsplora(url: string, psbt: PsbtLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    buildFeeBump(txid: string, newFeeRate: number): PsbtLike;
    calculateFee(txHex: string): bigint;
    calculateFeeRate(txHex: string): number;
    checkpoints(): Array<BlockId>;
    derivationIndex(keychain: KeychainKind): /*u32*/ number | undefined;
    derivationOfSpk(scriptHex: string): DerivationInfo | undefined;
    descriptorChecksum(keychain: KeychainKind): string;
    drain(address: string, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    drainWithElectrum(address: string, feeRate: number, client: ElectrumClientLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    finalizePsbt(psbt: PsbtLike): boolean;
    fullScanWithElectrum(client: ElectrumClientLike, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    fullScanWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    getBalance(): Balance;
    getTx(txid: string): /*throws*/ string | undefined;
    getUtxo(outpoint: OutPoint): /*throws*/ LocalOutput | undefined;
    insertTxout(outpoint: OutPoint, txout: TxOut): void;
    isMine(scriptHex: string): boolean;
    keychains(): Array<KeychainInfo>;
    latestCheckpoint(): BlockId | undefined;
    listOutput(): Array<LocalOutput>;
    listUnspent(): Array<LocalOutput>;
    listUnusedAddresses(keychain: KeychainKind): Array<AddressInfo>;
    markUsed(keychain: KeychainKind, index: number): boolean;
    network(): Network;
    nextDerivationIndex(keychain: KeychainKind): number;
    nextUnusedAddress(keychain: KeychainKind): AddressInfo;
    peekAddress(keychain: KeychainKind, index: number): AddressInfo;
    persist(): boolean;
    policies(keychain: KeychainKind): /*throws*/ string | undefined;
    publicDescriptor(keychain: KeychainKind): string;
    revealAddressesTo(keychain: KeychainKind, index: number): Array<AddressInfo>;
    revealNextAddress(keychain: KeychainKind): AddressInfo;
    send(address: string, amountSats: bigint, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    sendWithElectrum(address: string, amountSats: bigint, feeRate: number, client: ElectrumClientLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    sentAndReceived(txHex: string): SentAndReceived;
    sign(psbt: PsbtLike): boolean;
    syncWithElectrum(client: ElectrumClientLike, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    syncWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    transactions(): Array<TxDetails>;
    txDetails(txid: string): /*throws*/ TxDetails | undefined;
    unmarkUsed(keychain: KeychainKind, index: number): boolean;
}
/**
 * @deprecated Use `WalletLike` instead.
 */
export type WalletInterface = WalletLike;
export declare class Wallet extends UniffiAbstractObject implements WalletLike {
    readonly [uniffiTypeNameSymbol] = "Wallet";
    readonly [destructorGuardSymbol]: UniffiGcObject;
    readonly [pointerLiteralSymbol]: UniffiHandle;
    /**
     * Create or load a persisted wallet (sync — for async use create_wallet()).
     */
    constructor(descriptor: string, changeDescriptor: string | undefined, network: Network, dbPath: string);
    broadcastWithElectrum(client: ElectrumClientLike, psbt: PsbtLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    broadcastWithEsplora(url: string, psbt: PsbtLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    buildFeeBump(txid: string, newFeeRate: number): PsbtLike;
    calculateFee(txHex: string): bigint;
    calculateFeeRate(txHex: string): number;
    checkpoints(): Array<BlockId>;
    derivationIndex(keychain: KeychainKind): /*u32*/ number | undefined;
    derivationOfSpk(scriptHex: string): DerivationInfo | undefined;
    descriptorChecksum(keychain: KeychainKind): string;
    drain(address: string, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    drainWithElectrum(address: string, feeRate: number, client: ElectrumClientLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    finalizePsbt(psbt: PsbtLike): boolean;
    fullScanWithElectrum(client: ElectrumClientLike, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    fullScanWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    getBalance(): Balance;
    getTx(txid: string): string | undefined;
    getUtxo(outpoint: OutPoint): LocalOutput | undefined;
    insertTxout(outpoint: OutPoint, txout: TxOut): void;
    isMine(scriptHex: string): boolean;
    keychains(): Array<KeychainInfo>;
    latestCheckpoint(): BlockId | undefined;
    listOutput(): Array<LocalOutput>;
    listUnspent(): Array<LocalOutput>;
    listUnusedAddresses(keychain: KeychainKind): Array<AddressInfo>;
    markUsed(keychain: KeychainKind, index: number): boolean;
    network(): Network;
    nextDerivationIndex(keychain: KeychainKind): number;
    nextUnusedAddress(keychain: KeychainKind): AddressInfo;
    peekAddress(keychain: KeychainKind, index: number): AddressInfo;
    persist(): boolean;
    policies(keychain: KeychainKind): string | undefined;
    publicDescriptor(keychain: KeychainKind): string;
    revealAddressesTo(keychain: KeychainKind, index: number): Array<AddressInfo>;
    revealNextAddress(keychain: KeychainKind): AddressInfo;
    send(address: string, amountSats: bigint, feeRate: number, esploraUrl: string, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    sendWithElectrum(address: string, amountSats: bigint, feeRate: number, client: ElectrumClientLike, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<string>;
    sentAndReceived(txHex: string): SentAndReceived;
    sign(psbt: PsbtLike): boolean;
    syncWithElectrum(client: ElectrumClientLike, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    syncWithEsplora(url: string, stopGap: bigint, asyncOpts_?: {
        signal: AbortSignal;
    }): Promise<void>;
    transactions(): Array<TxDetails>;
    txDetails(txid: string): TxDetails | undefined;
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
        FfiConverterTypeElectrumClient: FfiConverterObject<ElectrumClientLike>;
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
        FfiConverterTypeMnemonic: FfiConverterObject<MnemonicLike>;
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
        FfiConverterTypePsbt: FfiConverterObject<PsbtLike>;
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
        FfiConverterTypeTxBuilder: FfiConverterObject<TxBuilderLike>;
        FfiConverterTypeTxDetails: {
            read(from: RustBuffer): TxDetails;
            write(value: TxDetails, into: RustBuffer): void;
            allocationSize(value: TxDetails): number;
            lift(value: UniffiByteArray): TxDetails;
            lower(value: TxDetails): UniffiByteArray;
        };
        FfiConverterTypeTxInput: {
            read(from: RustBuffer): TxInput;
            write(value: TxInput, into: RustBuffer): void;
            allocationSize(value: TxInput): number;
            lift(value: UniffiByteArray): TxInput;
            lower(value: TxInput): UniffiByteArray;
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
        FfiConverterTypeTxOutput: {
            read(from: RustBuffer): TxOutput;
            write(value: TxOutput, into: RustBuffer): void;
            allocationSize(value: TxOutput): number;
            lift(value: UniffiByteArray): TxOutput;
            lower(value: TxOutput): UniffiByteArray;
        };
        FfiConverterTypeWallet: FfiConverterObject<WalletLike>;
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