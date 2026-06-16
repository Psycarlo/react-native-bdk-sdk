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
import type { AddressInfo, BlockId, ChangeSpendPolicy, DerivationInfo, ElectrumClientLike, EsploraClientLike, KeychainInfo, KeychainKind, KyotoClientLike, KyotoNodeEventHandler, KyotoScanType, Network, OutPoint, PsbtLike, RpcClientLike, TxOrdering } from './generated/bdk_ffi';
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
/**
 * Number-friendly sync progress callback. `consumed` items processed out of
 * `total` items in the request — `consumed / total` is a completion fraction.
 * Called from a background thread; keep it fast and non-blocking.
 */
export type SyncProgressInspectorN = {
    inspect(consumed: number, total: number): void;
};
/**
 * Number-friendly full-scan progress callback. A full scan has no fixed total
 * (stop-gap driven), so only the running `visited` count of scripts is given,
 * not a fraction. Called from a background thread; keep it fast and non-blocking.
 */
export type FullScanProgressInspectorN = {
    inspect(keychain: KeychainKind, index: number, visited: number): void;
};
/** Progress of an in-flight Bitcoin Core RPC sync. */
export type RpcSyncProgressN = {
    /** Height of the block just applied. */
    currentHeight: number;
    /** The node's chain tip at the start of this sync. */
    tipHeight: number;
    /** Completion fraction in `[0, 1]` (`currentHeight / tipHeight`). */
    progress: number;
};
/**
 * Number-friendly RPC sync progress callback. Unlike Electrum/Esplora, an RPC
 * sync walks blocks toward a known tip, so `progress` is a real fraction (not a
 * raw count). Called from a background thread; keep it fast and non-blocking.
 */
export type RpcSyncProgressInspectorN = {
    inspect(progress: RpcSyncProgressN): void;
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
/** Pass a URL string (creates temp client) or a BdkEsploraClient (reuses). */
export type EsploraInput = string | BdkEsploraClient;
export declare class BdkEsploraClient {
    private readonly inner;
    constructor(url: string);
    get raw(): EsploraClientLike;
}
export type KyotoOptions = {
    /** Incremental `Sync` or full `Recovery` — see `KyotoScanType`. */
    scanType: KyotoScanType;
    /** Number of peers to maintain. Clamped to >= 1. Defaults to 2. */
    requiredPeers?: number;
    /** Explicit peer IPs. Empty (default) falls back to DNS discovery. */
    peers?: string[];
    /** Writable directory for header/peer persistence. */
    dataDir: string;
    /** Receives info/warning events emitted by the node while it runs. */
    handler: KyotoNodeEventHandler;
};
/**
 * Wraps a running Kyoto light client. Unlike Electrum/Esplora this owns a
 * long-lived P2P node: build it once from a wallet, reuse it across sync calls,
 * and call {@link shutdown} when done (it also stops on GC).
 */
export declare class BdkKyotoClient {
    private readonly inner;
    constructor(wallet: BdkWallet, opts: KyotoOptions);
    get raw(): KyotoClientLike;
    /** Whether the background node is still running. */
    isRunning(): boolean;
    /** Stop the node and release peer connections. */
    shutdown(): void;
}
/** A Kyoto client is stateful, so only an existing instance can be reused. */
export type KyotoInput = BdkKyotoClient;
/**
 * How to authenticate against the node's JSON-RPC endpoint.
 * - `cookieFile`: path to bitcoind's auto-generated `.cookie` (easiest locally).
 * - `userPass`: the `rpcuser` / `rpcpassword` from `bitcoin.conf`.
 * - `none`: no auth (e.g. behind an already-authenticated proxy).
 */
export type RpcAuth = {
    type: 'cookieFile';
    path: string;
} | {
    type: 'userPass';
    username: string;
    password: string;
} | {
    type: 'none';
};
export type RpcOptions = {
    /** Node RPC URL, e.g. `"http://127.0.0.1:8332"`. */
    url: string;
    auth: RpcAuth;
};
/**
 * Wraps a Bitcoin Core RPC connection. Downloads full blocks (max privacy — the
 * node never sees the wallet's scripts) at the cost of bandwidth. Build once and
 * reuse across {@link BdkWallet.syncWithRpc} / {@link BdkWallet.broadcastWithRpc}.
 */
export declare class BdkRpcClient {
    private readonly inner;
    constructor(opts: RpcOptions);
    get raw(): RpcClientLike;
    /** The node's current chain-tip height. */
    getBlockHeight(): number;
}
/** An RPC client owns a connection, so only an existing instance can be reused. */
export type RpcInput = BdkRpcClient;
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
    sign(psbt: PsbtLike): boolean;
    finalizePsbt(psbt: PsbtLike): boolean;
    fullScanWithEsplora(client: EsploraInput, stopGap: number, inspector?: FullScanProgressInspectorN): Promise<void>;
    syncWithEsplora(client: EsploraInput, stopGap: number, inspector?: SyncProgressInspectorN): Promise<void>;
    fullScanWithElectrum(client: ElectrumInput, stopGap: number, inspector?: FullScanProgressInspectorN): Promise<void>;
    syncWithElectrum(client: ElectrumInput, stopGap: number, inspector?: SyncProgressInspectorN): Promise<void>;
    /**
     * Sync against a Bitcoin Core node by downloading full blocks from
     * `startHeight` to the node's tip. Use the wallet's birthday height for
     * `startHeight` on first sync; it acts as a floor once the wallet has a
     * checkpoint. `fetchMempool` (default true) also applies unconfirmed txs.
     */
    syncWithRpc(client: RpcInput, startHeight: number, opts?: {
        fetchMempool?: boolean;
        inspector?: RpcSyncProgressInspectorN;
    }): Promise<void>;
    broadcastWithEsplora(client: EsploraInput, psbt: PsbtLike): Promise<string>;
    broadcastWithElectrum(client: ElectrumInput, psbt: PsbtLike): Promise<string>;
    broadcastWithRpc(client: RpcInput, psbt: PsbtLike): Promise<string>;
    /** Drives one sync against the Kyoto node; resolves once caught up to tip. */
    syncWithKyoto(client: KyotoInput): Promise<void>;
    broadcastWithKyoto(client: KyotoInput, psbt: PsbtLike): Promise<string>;
    send(address: string, amountSats: number, feeRate: number, esplora: EsploraInput): Promise<string>;
    drain(address: string, feeRate: number, esplora: EsploraInput): Promise<string>;
    sendWithElectrum(address: string, amountSats: number, feeRate: number, client: ElectrumInput): Promise<string>;
    drainWithElectrum(address: string, feeRate: number, client: ElectrumInput): Promise<string>;
    buildFeeBump(txid: string, newFeeRate: number): PsbtLike;
    /** Throws BdkError on invalid hex. */
    isMine(scriptHex: string): boolean;
    /** Throws BdkError on invalid hex. */
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
    addGlobalXpubs(): void;
    sighash(sighashType: number): void;
    policyPath(pathMapJson: string, keychain: KeychainKind): void;
    finish(wallet: BdkWallet): Promise<PsbtLike>;
}
//# sourceMappingURL=wrapper.d.ts.map