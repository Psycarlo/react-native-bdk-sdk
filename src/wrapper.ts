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

import type {
  AddressInfo,
  BlockId,
  ChangeSpendPolicy,
  Condition,
  CreatePsbtResult,
  DerivationInfo,
  ElectrumClientLike,
  EsploraClientLike,
  FinalizePsbtOutcome,
  FullScanProgressInspector,
  KeychainInfo,
  KeychainKind,
  KyotoClientLike,
  KyotoNodeEventHandler,
  KyotoScanType,
  Network,
  OutPoint,
  PsbtLike,
  RpcClientLike,
  RpcSyncProgressInspector,
  SelectionStrategy,
  SpendAssets,
  SyncProgressInspector,
  TxOrdering,
} from './generated/bdk_ffi';

import {
  ElectrumClient,
  EsploraClient,
  KyotoClient,
  PsbtParams,
  RpcClient,
  TxBuilder,
  Wallet,
  createWallet as rawCreateWallet,
  createWalletFromMultipath as rawCreateWalletFromMultipath,
} from './generated/bdk_ffi';

// ═══════════════════════════════════════════════════════════════════════════════
//  Number-friendly output types
// ═══════════════════════════════════════════════════════════════════════════════

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

// ── Converters ───────────────────────────────────────────────────────────────

function toConfirmationN(
  c?: { height: number; blockHash: string; timestamp: bigint }
): ConfirmationBlockTimeN | undefined {
  if (!c) return undefined;
  return { height: c.height, blockHash: c.blockHash, timestamp: Number(c.timestamp) };
}

function toBalanceN(b: {
  immature: bigint;
  trustedPending: bigint;
  untrustedPending: bigint;
  confirmed: bigint;
  trustedSpendable: bigint;
  total: bigint;
}): BalanceN {
  return {
    immature: Number(b.immature),
    trustedPending: Number(b.trustedPending),
    untrustedPending: Number(b.untrustedPending),
    confirmed: Number(b.confirmed),
    trustedSpendable: Number(b.trustedSpendable),
    total: Number(b.total),
  };
}

function toTxDetailsN(tx: {
  txid: string;
  sent: bigint;
  received: bigint;
  fee?: bigint;
  feeRate?: number;
  balanceDelta: bigint;
  confirmationBlockTime?: { height: number; blockHash: string; timestamp: bigint };
  version: number;
  locktime: number;
  inputs: Array<{ previousTxid: string; previousVout: number; sequence: number; scriptSigHex: string; witness: string[] }>;
  outputs: Array<{ value: bigint; scriptPubkeyHex: string; address?: string }>;
}): TxDetailsN {
  return {
    txid: tx.txid,
    sent: Number(tx.sent),
    received: Number(tx.received),
    fee: tx.fee != null ? Number(tx.fee) : undefined,
    feeRate: tx.feeRate ?? undefined,
    balanceDelta: Number(tx.balanceDelta),
    confirmationBlockTime: toConfirmationN(tx.confirmationBlockTime),
    version: tx.version,
    locktime: tx.locktime,
    inputs: tx.inputs.map((inp) => ({
      previousTxid: inp.previousTxid,
      previousVout: inp.previousVout,
      sequence: inp.sequence,
      scriptSigHex: inp.scriptSigHex,
      witness: inp.witness,
    })),
    outputs: tx.outputs.map((out) => ({
      value: Number(out.value),
      scriptPubkeyHex: out.scriptPubkeyHex,
      address: out.address ?? undefined,
    })),
  };
}

function toSentAndReceivedN(s: { sent: bigint; received: bigint }): SentAndReceivedN {
  return { sent: Number(s.sent), received: Number(s.received) };
}

function toLocalOutputN(o: {
  outpoint: OutPoint;
  txout: { value: bigint; scriptPubkeyHex: string };
  keychain: KeychainKind;
  isSpent: boolean;
  derivationIndex: number;
  confirmationBlockTime?: { height: number; blockHash: string; timestamp: bigint };
}): LocalOutputN {
  return {
    outpoint: o.outpoint,
    txout: { value: Number(o.txout.value), scriptPubkeyHex: o.txout.scriptPubkeyHex },
    keychain: o.keychain,
    isSpent: o.isSpent,
    derivationIndex: o.derivationIndex,
    confirmationBlockTime: toConfirmationN(o.confirmationBlockTime),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ElectrumClient wrapper
// ═══════════════════════════════════════════════════════════════════════════════

/** Pass a URL string (creates temp connection) or a BdkElectrumClient (reuses). */
export type ElectrumInput = string | BdkElectrumClient;

export class BdkElectrumClient {
  private readonly inner: ElectrumClient;

  constructor(url: string) {
    this.inner = new ElectrumClient(url);
  }

  get raw(): ElectrumClientLike {
    return this.inner;
  }
}

function resolveElectrum(input: ElectrumInput): ElectrumClientLike {
  if (typeof input === 'string') {
    return new ElectrumClient(input);
  }
  return input.raw;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EsploraClient wrapper
// ═══════════════════════════════════════════════════════════════════════════════

/** Pass a URL string (creates temp client) or a BdkEsploraClient (reuses). */
export type EsploraInput = string | BdkEsploraClient;

export class BdkEsploraClient {
  private readonly inner: EsploraClient;

  constructor(url: string) {
    this.inner = new EsploraClient(url);
  }

  get raw(): EsploraClientLike {
    return this.inner;
  }
}

function resolveEsplora(input: EsploraInput): EsploraClientLike {
  if (typeof input === 'string') {
    return new EsploraClient(input);
  }
  return input.raw;
}

// Bridge the number-friendly inspector callbacks to the bigint-based FFI ones.
// Counts here fit comfortably in a JS number (well under 2^53), so the bigint
// → number conversion is lossless.
function adaptSyncInspector(
  inspector?: SyncProgressInspectorN
): SyncProgressInspector | undefined {
  if (!inspector) return undefined;
  return {
    inspect: (consumed, total) =>
      inspector.inspect(Number(consumed), Number(total)),
  };
}

function adaptFullScanInspector(
  inspector?: FullScanProgressInspectorN
): FullScanProgressInspector | undefined {
  if (!inspector) return undefined;
  return {
    inspect: (keychain, index, visited) =>
      inspector.inspect(keychain, index, Number(visited)),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  KyotoClient wrapper (BIP157/158 light client)
// ═══════════════════════════════════════════════════════════════════════════════

export type KyotoOptions = {
  /** Incremental `Sync`, `NewWallet` or full `Recovery` — see `KyotoScanType`. */
  scanType: KyotoScanType;
  /** Number of peers to maintain. Clamped to >= 1. Defaults to 2. */
  requiredPeers?: number;
  /** Explicit peer IPs. Empty (default) falls back to DNS discovery. */
  peers?: string[];
  /**
   * @deprecated Ignored since bdk_kyoto 0.18, which no longer persists
   * headers or peers to disk. Will be removed in a future release.
   */
  dataDir?: string;
  /** Receives info/warning events emitted by the node while it runs. */
  handler: KyotoNodeEventHandler;
};

/**
 * Wraps a running Kyoto light client. Unlike Electrum/Esplora this owns a
 * long-lived P2P node: build it once from a wallet, reuse it across sync calls,
 * and call {@link shutdown} when done (it also stops on GC).
 */
export class BdkKyotoClient {
  private readonly inner: KyotoClient;

  constructor(wallet: BdkWallet, opts: KyotoOptions) {
    this.inner = new KyotoClient(
      wallet.raw,
      opts.scanType,
      opts.requiredPeers ?? 2,
      opts.peers ?? [],
      opts.dataDir ?? '',
      opts.handler
    );
  }

  get raw(): KyotoClientLike {
    return this.inner;
  }

  /** Whether the background node is still running. */
  isRunning(): boolean {
    return this.inner.isRunning();
  }

  /** Stop the node and release peer connections. */
  shutdown(): void {
    this.inner.shutdown();
  }
}

/** A Kyoto client is stateful, so only an existing instance can be reused. */
export type KyotoInput = BdkKyotoClient;

function resolveKyoto(input: KyotoInput): KyotoClientLike {
  return input.raw;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  RpcClient wrapper (Bitcoin Core full-node RPC)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * How to authenticate against the node's JSON-RPC endpoint.
 * - `cookieFile`: path to bitcoind's auto-generated `.cookie` (easiest locally).
 * - `userPass`: the `rpcuser` / `rpcpassword` from `bitcoin.conf`.
 * - `none`: no auth (e.g. behind an already-authenticated proxy).
 */
export type RpcAuth =
  | { type: 'cookieFile'; path: string }
  | { type: 'userPass'; username: string; password: string }
  | { type: 'none' };

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
export class BdkRpcClient {
  private readonly inner: RpcClient;

  constructor(opts: RpcOptions) {
    const a = opts.auth;
    this.inner = new RpcClient(
      opts.url,
      a.type === 'userPass' ? a.username : undefined,
      a.type === 'userPass' ? a.password : undefined,
      a.type === 'cookieFile' ? a.path : undefined
    );
  }

  get raw(): RpcClientLike {
    return this.inner;
  }

  /** The node's current chain-tip height. */
  getBlockHeight(): number {
    return this.inner.getBlockHeight();
  }
}

/** An RPC client owns a connection, so only an existing instance can be reused. */
export type RpcInput = BdkRpcClient;

function resolveRpc(input: RpcInput): RpcClientLike {
  return input.raw;
}

// Bridge the throttled bigint-free FFI callback to the friendly fraction object.
function adaptRpcInspector(
  inspector?: RpcSyncProgressInspectorN
): RpcSyncProgressInspector | undefined {
  if (!inspector) return undefined;
  return {
    inspect: (currentHeight, tipHeight) => {
      const current = Number(currentHeight);
      const tip = Number(tipHeight);
      const progress = tip > 0 ? Math.min(1, current / tip) : 0;
      inspector.inspect({ currentHeight: current, tipHeight: tip, progress });
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Async wallet factory
// ═══════════════════════════════════════════════════════════════════════════════

export async function bdkCreateWallet(
  descriptor: string,
  changeDescriptor: string | undefined,
  network: Network,
  dbPath: string
): Promise<BdkWallet> {
  const inner = await rawCreateWallet(descriptor, changeDescriptor, network, dbPath);
  return BdkWallet.fromRaw(inner as Wallet);
}

export async function bdkCreateWalletFromMultipath(
  descriptor: string,
  network: Network,
  dbPath: string
): Promise<BdkWallet> {
  const inner = await rawCreateWalletFromMultipath(descriptor, network, dbPath);
  return BdkWallet.fromRaw(inner as Wallet);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Wallet wrapper
// ═══════════════════════════════════════════════════════════════════════════════

export class BdkWallet {
  private readonly inner: Wallet;

  constructor(
    descriptor: string,
    changeDescriptor: string | undefined,
    network: Network,
    dbPath: string
  ) {
    this.inner = new Wallet(descriptor, changeDescriptor, network, dbPath);
  }

  static fromRaw(wallet: Wallet): BdkWallet {
    const instance = Object.create(BdkWallet.prototype) as BdkWallet;
    (instance as any).inner = wallet;
    return instance;
  }

  static fromMultipath(
    descriptor: string,
    network: Network,
    dbPath: string
  ): BdkWallet {
    return BdkWallet.fromRaw(Wallet.newFromMultipath(descriptor, network, dbPath) as Wallet);
  }

  get raw(): Wallet {
    return this.inner;
  }

  // ── Address management ──────────────────────────────────────────────────

  nextUnusedAddress(keychain: KeychainKind): AddressInfo {
    return this.inner.nextUnusedAddress(keychain);
  }

  revealNextAddress(keychain: KeychainKind): AddressInfo {
    return this.inner.revealNextAddress(keychain);
  }

  revealAddressesTo(keychain: KeychainKind, index: number): AddressInfo[] {
    return this.inner.revealAddressesTo(keychain, index);
  }

  peekAddress(keychain: KeychainKind, index: number): AddressInfo {
    return this.inner.peekAddress(keychain, index);
  }

  listUnusedAddresses(keychain: KeychainKind): AddressInfo[] {
    return this.inner.listUnusedAddresses(keychain);
  }

  markUsed(keychain: KeychainKind, index: number): boolean {
    return this.inner.markUsed(keychain, index);
  }

  unmarkUsed(keychain: KeychainKind, index: number): boolean {
    return this.inner.unmarkUsed(keychain, index);
  }

  // ── Balance ─────────────────────────────────────────────────────────────

  getBalance(): BalanceN {
    return toBalanceN(this.inner.getBalance());
  }

  // ── UTXOs ───────────────────────────────────────────────────────────────

  listUnspent(): LocalOutputN[] {
    return this.inner.listUnspent().map(toLocalOutputN);
  }

  listOutput(): LocalOutputN[] {
    return this.inner.listOutput().map(toLocalOutputN);
  }

  getUtxo(outpoint: OutPoint): LocalOutputN | undefined {
    const o = this.inner.getUtxo(outpoint);
    return o ? toLocalOutputN(o) : undefined;
  }

  insertTxout(outpoint: OutPoint, txout: { value: number; scriptPubkeyHex: string }): void {
    this.inner.insertTxout(outpoint, {
      value: BigInt(txout.value),
      scriptPubkeyHex: txout.scriptPubkeyHex,
    });
  }

  // ── Transactions ────────────────────────────────────────────────────────

  transactions(): TxDetailsN[] {
    return this.inner.transactions().map(toTxDetailsN);
  }

  txDetails(txid: string): TxDetailsN | undefined {
    const tx = this.inner.txDetails(txid);
    return tx ? toTxDetailsN(tx) : undefined;
  }

  getTx(txid: string): string | undefined {
    return this.inner.getTx(txid);
  }

  sentAndReceived(txHex: string): SentAndReceivedN {
    return toSentAndReceivedN(this.inner.sentAndReceived(txHex));
  }

  calculateFee(txHex: string): number {
    return Number(this.inner.calculateFee(txHex));
  }

  calculateFeeRate(txHex: string): number {
    return this.inner.calculateFeeRate(txHex);
  }

  // ── PSBT / Signing ──────────────────────────────────────────────────────

  sign(psbt: PsbtLike): boolean {
    return this.inner.sign(psbt);
  }

  finalizePsbt(psbt: PsbtLike): boolean {
    return this.inner.finalizePsbt(psbt);
  }

  /**
   * Like {@link finalizePsbt}, but also reports the outcome of every input
   * (finalized, already final, foreign input, or unsatisfied with the reason).
   */
  tryFinalizePsbt(psbt: PsbtLike): FinalizePsbtOutcome {
    return this.inner.tryFinalizePsbt(psbt);
  }

  /**
   * Sign with private keys from the given descriptors instead of keys held by
   * the wallet, so the wallet itself can stay watch-only. Multipath (`<0;1>`)
   * private descriptors are not supported; pass one descriptor per path.
   * Returns whether the PSBT was finalized.
   */
  signWithDescriptors(psbt: PsbtLike, descriptors: string[]): boolean {
    return this.inner.signWithDescriptors(psbt, descriptors);
  }

  // ── Experimental PSBT API (bdk-tx) ──────────────────────────────────────

  /**
   * **Experimental.** Create a PSBT with bdk_wallet's bdk-tx API. Sign the
   * PSBT, then finalize it with the returned `finalizer`. Persists the wallet
   * afterwards (a change address may be revealed). May change in future releases.
   */
  createPsbt(params: BdkPsbtParams): Promise<CreatePsbtResult> {
    return this.inner.createPsbt(params.raw);
  }

  /**
   * **Experimental.** Replace one or more unconfirmed wallet transactions
   * (RBF). The replacement spends the inputs of the originals, so
   * `params.addUtxo(s)` is ignored; add recipients again (they are not copied
   * from the originals). Persists the wallet afterwards.
   */
  replaceByFee(params: BdkPsbtParams, txids: string[]): Promise<CreatePsbtResult> {
    return this.inner.replaceByFee(params.raw, txids);
  }

  // ── Sync (Esplora) ─────────────────────────────────────────────────────

  fullScanWithEsplora(
    client: EsploraInput,
    stopGap: number,
    inspector?: FullScanProgressInspectorN
  ): Promise<void> {
    return this.inner.fullScanWithEsplora(
      resolveEsplora(client),
      BigInt(stopGap),
      adaptFullScanInspector(inspector)
    );
  }

  syncWithEsplora(
    client: EsploraInput,
    stopGap: number,
    inspector?: SyncProgressInspectorN
  ): Promise<void> {
    return this.inner.syncWithEsplora(
      resolveEsplora(client),
      BigInt(stopGap),
      adaptSyncInspector(inspector)
    );
  }

  // ── Sync (Electrum) ────────────────────────────────────────────────────

  fullScanWithElectrum(
    client: ElectrumInput,
    stopGap: number,
    inspector?: FullScanProgressInspectorN
  ): Promise<void> {
    return this.inner.fullScanWithElectrum(
      resolveElectrum(client),
      BigInt(stopGap),
      adaptFullScanInspector(inspector)
    );
  }

  syncWithElectrum(
    client: ElectrumInput,
    stopGap: number,
    inspector?: SyncProgressInspectorN
  ): Promise<void> {
    return this.inner.syncWithElectrum(
      resolveElectrum(client),
      BigInt(stopGap),
      adaptSyncInspector(inspector)
    );
  }

  // ── Sync (Bitcoin Core RPC) ─────────────────────────────────────────────

  /**
   * Sync against a Bitcoin Core node by downloading full blocks from
   * `startHeight` to the node's tip. Use the wallet's birthday height for
   * `startHeight` on first sync; it acts as a floor once the wallet has a
   * checkpoint. `fetchMempool` (default true) also applies unconfirmed txs.
   */
  syncWithRpc(
    client: RpcInput,
    startHeight: number,
    opts?: { fetchMempool?: boolean; inspector?: RpcSyncProgressInspectorN }
  ): Promise<void> {
    return this.inner.syncWithRpc(
      resolveRpc(client),
      startHeight,
      opts?.fetchMempool ?? true,
      adaptRpcInspector(opts?.inspector)
    );
  }

  // ── Broadcast ───────────────────────────────────────────────────────────

  broadcastWithEsplora(client: EsploraInput, psbt: PsbtLike): Promise<string> {
    return this.inner.broadcastWithEsplora(resolveEsplora(client), psbt);
  }

  broadcastWithElectrum(client: ElectrumInput, psbt: PsbtLike): Promise<string> {
    return this.inner.broadcastWithElectrum(resolveElectrum(client), psbt);
  }

  broadcastWithRpc(client: RpcInput, psbt: PsbtLike): Promise<string> {
    return this.inner.broadcastWithRpc(resolveRpc(client), psbt);
  }

  // ── Sync / Broadcast (Kyoto) ────────────────────────────────────────────

  /** Drives one sync against the Kyoto node; resolves once caught up to tip. */
  syncWithKyoto(client: KyotoInput): Promise<void> {
    return this.inner.syncWithKyoto(resolveKyoto(client));
  }

  broadcastWithKyoto(client: KyotoInput, psbt: PsbtLike): Promise<string> {
    return this.inner.broadcastWithKyoto(resolveKyoto(client), psbt);
  }

  // ── Convenience (Esplora) ───────────────────────────────────────────────

  send(address: string, amountSats: number, feeRate: number, esplora: EsploraInput): Promise<string> {
    return this.inner.send(address, BigInt(amountSats), feeRate, resolveEsplora(esplora));
  }

  drain(address: string, feeRate: number, esplora: EsploraInput): Promise<string> {
    return this.inner.drain(address, feeRate, resolveEsplora(esplora));
  }

  // ── Convenience (Electrum) ──────────────────────────────────────────────

  sendWithElectrum(
    address: string,
    amountSats: number,
    feeRate: number,
    client: ElectrumInput
  ): Promise<string> {
    return this.inner.sendWithElectrum(address, BigInt(amountSats), feeRate, resolveElectrum(client));
  }

  drainWithElectrum(address: string, feeRate: number, client: ElectrumInput): Promise<string> {
    return this.inner.drainWithElectrum(address, feeRate, resolveElectrum(client));
  }

  // ── Fee bumping ─────────────────────────────────────────────────────────

  /** Persists the wallet afterwards (a change address may be revealed). */
  buildFeeBump(txid: string, newFeeRate: number): PsbtLike {
    return this.inner.buildFeeBump(txid, newFeeRate);
  }

  // ── Script / SPK queries ────────────────────────────────────────────────

  /** Throws BdkError on invalid hex. */
  isMine(scriptHex: string): boolean {
    return this.inner.isMine(scriptHex);
  }

  /** Throws BdkError on invalid hex. */
  derivationOfSpk(scriptHex: string): DerivationInfo | undefined {
    return this.inner.derivationOfSpk(scriptHex);
  }

  // ── Descriptor / keychain info ──────────────────────────────────────────

  publicDescriptor(keychain: KeychainKind): string {
    return this.inner.publicDescriptor(keychain);
  }

  descriptorChecksum(keychain: KeychainKind): string {
    return this.inner.descriptorChecksum(keychain);
  }

  keychains(): KeychainInfo[] {
    return this.inner.keychains();
  }

  policies(keychain: KeychainKind): string | undefined {
    return this.inner.policies(keychain);
  }

  /**
   * Spending policy of the keychain's descriptor as JSON (`undefined` for a
   * plain single-key descriptor). Use the policy item `id`s to build a path
   * map for {@link policyCondition}. Ids may differ from {@link policies}
   * when the wallet holds private keys, so don't mix them with
   * `BdkTxBuilder.policyPath`.
   */
  spendingPolicy(keychain: KeychainKind): string | undefined {
    return this.inner.spendingPolicy(keychain);
  }

  /**
   * Timelock requirements of a spending path, for `BdkTxBuilder.setCondition`.
   * `pathMapJson` maps policy item ids to the chosen child indexes, e.g.
   * `{"abcd1234": [1]}`. Returns an empty condition for descriptors without a policy.
   */
  policyCondition(pathMapJson: string, keychain: KeychainKind): Condition {
    return this.inner.policyCondition(pathMapJson, keychain);
  }

  derivationIndex(keychain: KeychainKind): number | undefined {
    return this.inner.derivationIndex(keychain);
  }

  nextDerivationIndex(keychain: KeychainKind): number {
    return this.inner.nextDerivationIndex(keychain);
  }

  // ── Chain state ─────────────────────────────────────────────────────────

  latestCheckpoint(): BlockId | undefined {
    return this.inner.latestCheckpoint();
  }

  checkpoints(): BlockId[] {
    return this.inner.checkpoints();
  }

  // ── Persistence ─────────────────────────────────────────────────────────

  persist(): boolean {
    return this.inner.persist();
  }

  // ── Accessors ───────────────────────────────────────────────────────────

  network(): Network {
    return this.inner.network();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TxBuilder wrapper
// ═══════════════════════════════════════════════════════════════════════════════

export class BdkTxBuilder {
  private readonly inner: TxBuilder;

  constructor() {
    this.inner = new TxBuilder();
  }

  get raw(): TxBuilder {
    return this.inner;
  }

  addRecipient(address: string, amountSats: number): void {
    this.inner.addRecipient(address, BigInt(amountSats));
  }

  setRecipients(recipients: Array<{ address: string; amountSats: number }>): void {
    this.inner.setRecipients(
      recipients.map((r) => ({ address: r.address, amountSats: BigInt(r.amountSats) }))
    );
  }

  addData(data: Array<number>): void {
    this.inner.addData(new Uint8Array(data).buffer);
  }

  feeRate(satPerVbyte: number): void {
    this.inner.feeRate(satPerVbyte);
  }

  feeAbsolute(feeSats: number): void {
    this.inner.feeAbsolute(BigInt(feeSats));
  }

  drainWallet(): void {
    this.inner.drainWallet();
  }

  drainTo(address: string): void {
    this.inner.drainTo(address);
  }

  manuallySelectedOnly(): void {
    this.inner.manuallySelectedOnly();
  }

  addUtxo(outpoint: OutPoint): void {
    this.inner.addUtxo(outpoint);
  }

  addUtxos(outpoints: Array<OutPoint>): void {
    this.inner.addUtxos(outpoints);
  }

  unspendable(outpoints: Array<OutPoint>): void {
    this.inner.unspendable(outpoints);
  }

  addUnspendable(outpoint: OutPoint): void {
    this.inner.addUnspendable(outpoint);
  }

  excludeBelowConfirmations(minConfirms: number): void {
    this.inner.excludeBelowConfirmations(minConfirms);
  }

  excludeUnconfirmed(): void {
    this.inner.excludeUnconfirmed();
  }

  doNotSpendChange(): void {
    this.inner.doNotSpendChange();
  }

  onlySpendChange(): void {
    this.inner.onlySpendChange();
  }

  changePolicy(policy: ChangeSpendPolicy): void {
    this.inner.changePolicy(policy);
  }

  enableRbf(): void {
    this.inner.enableRbf();
  }

  enableRbfWithSequence(nsequence: number): void {
    this.inner.enableRbfWithSequence(nsequence);
  }

  setExactSequence(nsequence: number): void {
    this.inner.setExactSequence(nsequence);
  }

  ordering(ordering: TxOrdering): void {
    this.inner.ordering(ordering);
  }

  nlocktime(lockHeight: number): void {
    this.inner.nlocktime(lockHeight);
  }

  txVersion(version: number): void {
    this.inner.txVersion(version);
  }

  allowDust(allow: boolean): void {
    this.inner.allowDust(allow);
  }

  currentHeight(height: number): void {
    this.inner.currentHeight(height);
  }

  onlyWitnessUtxo(): void {
    this.inner.onlyWitnessUtxo();
  }

  addGlobalXpubs(): void {
    this.inner.addGlobalXpubs();
  }

  /**
   * Sighash type for every input, e.g. `0x81` (ALL|ANYONECANPAY).
   * `BdkWallet.sign` and `signWithDescriptors` only sign `SIGHASH_ALL` /
   * `SIGHASH_DEFAULT` inputs, so other types must be signed externally.
   */
  sighash(sighashType: number): void {
    this.inner.sighash(sighashType);
  }

  policyPath(pathMapJson: string, keychain: KeychainKind): void {
    this.inner.policyPath(pathMapJson, keychain);
  }

  /**
   * Apply the timelocks of a spending path (nLockTime / nSequence) without a
   * policy path. Get one from `BdkWallet.policyCondition`, or build it
   * directly. Takes precedence over {@link policyPath} when both are set.
   */
  setCondition(condition: Condition): void {
    this.inner.setCondition(condition);
  }

  /** Persists the wallet afterwards (a change address may be revealed). */
  async finish(wallet: BdkWallet): Promise<PsbtLike> {
    return this.inner.finish(wallet.raw);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PsbtParams wrapper (experimental bdk-tx API)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * **Experimental.** Parameters for {@link BdkWallet.createPsbt} and
 * {@link BdkWallet.replaceByFee}. Unlike {@link BdkTxBuilder}, spending paths
 * are chosen with {@link addAssets} and the result comes with a `Finalizer`.
 * May change in future releases.
 */
export class BdkPsbtParams {
  private readonly inner: PsbtParams;

  constructor() {
    this.inner = new PsbtParams();
  }

  get raw(): PsbtParams {
    return this.inner;
  }

  // ── Inputs ──────────────────────────────────────────────────────────────

  /** Must-spend a wallet UTXO. Ignored by `replaceByFee`. */
  addUtxo(outpoint: OutPoint): void {
    this.inner.addUtxo(outpoint);
  }

  addUtxos(outpoints: Array<OutPoint>): void {
    this.inner.addUtxos(outpoints);
  }

  removeUtxo(outpoint: OutPoint): void {
    this.inner.removeUtxo(outpoint);
  }

  /** Only spend the UTXOs added with `addUtxo(s)`. */
  manuallySelectedOnly(): void {
    this.inner.manuallySelectedOnly();
  }

  /** Exclude UTXOs from coin selection. */
  unspendable(outpoints: Array<OutPoint>): void {
    this.inner.unspendable(outpoints);
  }

  addUnspendable(outpoint: OutPoint): void {
    this.inner.addUnspendable(outpoint);
  }

  excludeBelowConfirmations(minConfirms: number): void {
    this.inner.excludeBelowConfirmations(minConfirms);
  }

  excludeUnconfirmed(): void {
    this.inner.excludeUnconfirmed();
  }

  changePolicy(policy: ChangeSpendPolicy): void {
    this.inner.changePolicy(policy);
  }

  // ── Outputs ─────────────────────────────────────────────────────────────

  addRecipient(address: string, amountSats: number): void {
    this.inner.addRecipient(address, BigInt(amountSats));
  }

  addRecipients(recipients: Array<{ address: string; amountSats: number }>): void {
    this.inner.addRecipients(
      recipients.map((r) => ({ address: r.address, amountSats: BigInt(r.amountSats) }))
    );
  }

  /** Add an OP_RETURN output carrying `data`. */
  addData(data: Array<number>): void {
    this.inner.addData(new Uint8Array(data).buffer);
  }

  /**
   * Send change to this address instead of the wallet's next unused change
   * address. Required for a sweep (`SelectionStrategy.All` with no recipients).
   */
  changeAddress(address: string): void {
    this.inner.changeAddress(address);
  }

  // ── Spending path / timelocks ───────────────────────────────────────────

  /**
   * Add spending assets (signing keys and usable timelocks). Without assets
   * every wallet key is assumed able to sign. Only the last `after`/`older`
   * set across calls is kept.
   */
  addAssets(assets: SpendAssets): void {
    this.inner.addAssets(assets);
  }

  /** Minimum nLockTime (height below 500,000,000, otherwise a UNIX timestamp). */
  locktime(locktime: number): void {
    this.inner.locktime(locktime);
  }

  /** Height used to evaluate coinbase maturity. Defaults to the wallet tip. */
  maturityHeight(height: number): void {
    this.inner.maturityHeight(height);
  }

  /** Enable BIP-326 anti-fee-sniping using `tipHeight` as the current height. */
  antiFeeSnipingHeight(tipHeight: number): void {
    this.inner.antiFeeSnipingHeight(tipHeight);
  }

  // ── Fees / coin selection ───────────────────────────────────────────────

  /** Target fee rate in sat/vB. Defaults to 1 sat/vB. */
  feeRate(satPerVbyte: number): void {
    this.inner.feeRate(satPerVbyte);
  }

  coinSelection(strategy: SelectionStrategy): void {
    this.inner.coinSelection(strategy);
  }

  /** Treat these transactions as canonical (winning any conflicts). */
  assumeCanonical(txids: string[]): void {
    this.inner.assumeCanonical(txids);
  }

  // ── Layout ──────────────────────────────────────────────────────────────

  ordering(ordering: TxOrdering): void {
    this.inner.ordering(ordering);
  }

  onlyWitnessUtxo(): void {
    this.inner.onlyWitnessUtxo();
  }

  /**
   * Transaction version. With version 3 (TRUC), coin selection only spends
   * unconfirmed UTXOs from v3 parents, and vice versa (BIP-431 rule 2).
   * Manually added UTXOs bypass this check.
   */
  version(version: number): void {
    this.inner.version(version);
  }

  addGlobalXpubs(): void {
    this.inner.addGlobalXpubs();
  }

  // ── Sequences ───────────────────────────────────────────────────────────

  /** nSequence for a UTXO added with `addUtxo(s)`. Takes precedence over {@link fallbackSequence}. */
  sequenceOverride(outpoint: OutPoint, nsequence: number): void {
    this.inner.sequenceOverride(outpoint, nsequence);
  }

  /** nSequence for wallet inputs with no override and no CSV requirement. */
  fallbackSequence(nsequence: number): void {
    this.inner.fallbackSequence(nsequence);
  }
}
