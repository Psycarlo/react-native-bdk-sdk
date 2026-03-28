/**
 * Number-friendly wrappers for react-native-bdk-sdk.
 *
 * The generated FFI bindings use `bigint` for all u64/i64 fields.
 * These wrappers accept plain `number` for satoshi amounts and stop gaps,
 * and return `number` in output types — for a more natural React Native DX.
 *
 * JS `number` safely handles up to 2^53 (~9 quadrillion), which covers
 * the entire Bitcoin supply in satoshis (2.1 quadrillion).
 */
import type { AddressInfo, BlockId, ChangeSpendPolicy, DerivationInfo, ElectrumClientLike, KeychainInfo, KeychainKind, Network, OutPoint, PsbtLike, TxOrdering } from './generated/bdk_ffi';
import { TxBuilder, Wallet } from './generated/bdk_ffi';
export type BalanceN = {
    immature: number;
    trustedPending: number;
    untrustedPending: number;
    confirmed: number;
    trustedSpendable: number;
    total: number;
};
export type ConfirmationBlockTimeN = {
    height: number;
    blockHash: string;
    timestamp: number;
};
export type TxOutN = {
    value: number;
    scriptPubkeyHex: string;
};
export type LocalOutputN = {
    outpoint: OutPoint;
    txout: TxOutN;
    keychain: KeychainKind;
    isSpent: boolean;
    derivationIndex: number;
    confirmationBlockTime?: ConfirmationBlockTimeN;
};
export type SentAndReceivedN = {
    sent: number;
    received: number;
};
export type TxInputN = {
    previousTxid: string;
    previousVout: number;
    sequence: number;
    scriptSigHex: string;
    witness: string[];
};
export type TxOutputN = {
    value: number;
    scriptPubkeyHex: string;
    address?: string;
};
export type TxDetailsN = {
    txid: string;
    sent: number;
    received: number;
    fee?: number;
    feeRate?: number;
    balanceDelta: number;
    confirmationBlockTime?: ConfirmationBlockTimeN;
    txHex: string;
    version: number;
    locktime: number;
    inputs: TxInputN[];
    outputs: TxOutputN[];
};
/** Pass a URL string (creates temp connection) or a BdkElectrumClient (reuses). */
export type ElectrumInput = string | BdkElectrumClient;
export declare class BdkElectrumClient {
    private readonly inner;
    constructor(url: string);
    get raw(): ElectrumClientLike;
}
export declare function bdkCreateWallet(descriptor: string, changeDescriptor: string | undefined, network: Network, dbPath: string): Promise<BdkWallet>;
export declare class BdkWallet {
    private readonly inner;
    constructor(descriptor: string, changeDescriptor: string | undefined, network: Network, dbPath: string);
    static fromRaw(wallet: Wallet): BdkWallet;
    get raw(): Wallet;
    nextUnusedAddress(keychain: KeychainKind): AddressInfo;
    revealNextAddress(keychain: KeychainKind): AddressInfo;
    revealAddressesTo(keychain: KeychainKind, index: number): AddressInfo[];
    peekAddress(keychain: KeychainKind, index: number): AddressInfo;
    listUnusedAddresses(keychain: KeychainKind): AddressInfo[];
    markUsed(keychain: KeychainKind, index: number): boolean;
    unmarkUsed(keychain: KeychainKind, index: number): boolean;
    getBalance(): BalanceN;
    listUnspent(): LocalOutputN[];
    listOutput(): LocalOutputN[];
    getUtxo(outpoint: OutPoint): LocalOutputN | undefined;
    insertTxout(outpoint: OutPoint, txout: {
        value: number;
        scriptPubkeyHex: string;
    }): void;
    transactions(): TxDetailsN[];
    txDetails(txid: string): TxDetailsN | undefined;
    getTx(txid: string): string | undefined;
    sentAndReceived(txHex: string): SentAndReceivedN;
    calculateFee(txHex: string): number;
    calculateFeeRate(txHex: string): number;
    cancelTx(txHex: string): void;
    sign(psbt: PsbtLike): boolean;
    finalizePsbt(psbt: PsbtLike): boolean;
    fullScanWithEsplora(url: string, stopGap: number): Promise<void>;
    syncWithEsplora(url: string, stopGap: number): Promise<void>;
    fullScanWithElectrum(client: ElectrumInput, stopGap: number): Promise<void>;
    syncWithElectrum(client: ElectrumInput, stopGap: number): Promise<void>;
    broadcastWithEsplora(url: string, psbt: PsbtLike): Promise<string>;
    broadcastWithElectrum(client: ElectrumInput, psbt: PsbtLike): Promise<string>;
    send(address: string, amountSats: number, feeRate: number, esploraUrl: string): Promise<string>;
    drain(address: string, feeRate: number, esploraUrl: string): Promise<string>;
    sendWithElectrum(address: string, amountSats: number, feeRate: number, client: ElectrumInput): Promise<string>;
    drainWithElectrum(address: string, feeRate: number, client: ElectrumInput): Promise<string>;
    buildFeeBump(txid: string, newFeeRate: number): PsbtLike;
    isMine(scriptHex: string): boolean;
    derivationOfSpk(scriptHex: string): DerivationInfo | undefined;
    publicDescriptor(keychain: KeychainKind): string;
    descriptorChecksum(keychain: KeychainKind): string;
    keychains(): KeychainInfo[];
    policies(keychain: KeychainKind): string | undefined;
    derivationIndex(keychain: KeychainKind): number | undefined;
    nextDerivationIndex(keychain: KeychainKind): number;
    latestCheckpoint(): BlockId | undefined;
    checkpoints(): BlockId[];
    persist(): boolean;
    network(): Network;
}
export declare class BdkTxBuilder {
    private readonly inner;
    constructor();
    get raw(): TxBuilder;
    addRecipient(address: string, amountSats: number): void;
    setRecipients(recipients: Array<{
        address: string;
        amountSats: number;
    }>): void;
    addData(data: Array<number>): void;
    feeRate(satPerVbyte: number): void;
    feeAbsolute(feeSats: number): void;
    drainWallet(): void;
    drainTo(address: string): void;
    manuallySelectedOnly(): void;
    addUtxo(outpoint: OutPoint): void;
    addUtxos(outpoints: Array<OutPoint>): void;
    unspendable(outpoints: Array<OutPoint>): void;
    addUnspendable(outpoint: OutPoint): void;
    excludeBelowConfirmations(minConfirms: number): void;
    excludeUnconfirmed(): void;
    doNotSpendChange(): void;
    onlySpendChange(): void;
    changePolicy(policy: ChangeSpendPolicy): void;
    enableRbf(): void;
    enableRbfWithSequence(nsequence: number): void;
    setExactSequence(nsequence: number): void;
    ordering(ordering: TxOrdering): void;
    nlocktime(lockHeight: number): void;
    txVersion(version: number): void;
    allowDust(allow: boolean): void;
    currentHeight(height: number): void;
    onlyWitnessUtxo(): void;
    includeOutputRedeemWitnessScript(): void;
    addGlobalXpubs(): void;
    sighash(sighashType: number): void;
    policyPath(pathMapJson: string, keychain: KeychainKind): void;
    finish(wallet: BdkWallet): Promise<PsbtLike>;
}
//# sourceMappingURL=wrapper.d.ts.map