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
  DerivationInfo,
  ElectrumClientLike,
  EsploraClientLike,
  KeychainInfo,
  KeychainKind,
  Network,
  OutPoint,
  PsbtLike,
  TxOrdering,
} from './generated/bdk_ffi';

import {
  ElectrumClient,
  EsploraClient,
  TxBuilder,
  Wallet,
  createWallet as rawCreateWallet,
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

  // ── Sync (Esplora) ─────────────────────────────────────────────────────

  fullScanWithEsplora(client: EsploraInput, stopGap: number): Promise<void> {
    return this.inner.fullScanWithEsplora(resolveEsplora(client), BigInt(stopGap));
  }

  syncWithEsplora(client: EsploraInput, stopGap: number): Promise<void> {
    return this.inner.syncWithEsplora(resolveEsplora(client), BigInt(stopGap));
  }

  // ── Sync (Electrum) ────────────────────────────────────────────────────

  fullScanWithElectrum(client: ElectrumInput, stopGap: number): Promise<void> {
    return this.inner.fullScanWithElectrum(resolveElectrum(client), BigInt(stopGap));
  }

  syncWithElectrum(client: ElectrumInput, stopGap: number): Promise<void> {
    return this.inner.syncWithElectrum(resolveElectrum(client), BigInt(stopGap));
  }

  // ── Broadcast ───────────────────────────────────────────────────────────

  broadcastWithEsplora(client: EsploraInput, psbt: PsbtLike): Promise<string> {
    return this.inner.broadcastWithEsplora(resolveEsplora(client), psbt);
  }

  broadcastWithElectrum(client: ElectrumInput, psbt: PsbtLike): Promise<string> {
    return this.inner.broadcastWithElectrum(resolveElectrum(client), psbt);
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

  buildFeeBump(txid: string, newFeeRate: number): PsbtLike {
    return this.inner.buildFeeBump(txid, newFeeRate);
  }

  // ── Script / SPK queries ────────────────────────────────────────────────

  isMine(scriptHex: string): boolean {
    return this.inner.isMine(scriptHex);
  }

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

  sighash(sighashType: number): void {
    this.inner.sighash(sighashType);
  }

  policyPath(pathMapJson: string, keychain: KeychainKind): void {
    this.inner.policyPath(pathMapJson, keychain);
  }

  async finish(wallet: BdkWallet): Promise<PsbtLike> {
    return this.inner.finish(wallet.raw);
  }
}
