"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BdkWallet = exports.BdkTxBuilder = exports.BdkRpcClient = exports.BdkKyotoClient = exports.BdkEsploraClient = exports.BdkElectrumClient = void 0;
exports.bdkCreateWallet = bdkCreateWallet;
exports.bdkCreateWalletFromMultipath = bdkCreateWalletFromMultipath;
var _bdk_ffi = require("./generated/bdk_ffi.js");
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

// ═══════════════════════════════════════════════════════════════════════════════
//  Number-friendly output types
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Number-friendly sync progress callback. `consumed` items processed out of
 * `total` items in the request — `consumed / total` is a completion fraction.
 * Called from a background thread; keep it fast and non-blocking.
 */

/**
 * Number-friendly full-scan progress callback. A full scan has no fixed total
 * (stop-gap driven), so only the running `visited` count of scripts is given,
 * not a fraction. Called from a background thread; keep it fast and non-blocking.
 */

/** Progress of an in-flight Bitcoin Core RPC sync. */

/**
 * Number-friendly RPC sync progress callback. Unlike Electrum/Esplora, an RPC
 * sync walks blocks toward a known tip, so `progress` is a real fraction (not a
 * raw count). Called from a background thread; keep it fast and non-blocking.
 */

// ── Converters ───────────────────────────────────────────────────────────────

function toConfirmationN(c) {
  if (!c) return undefined;
  return {
    height: c.height,
    blockHash: c.blockHash,
    timestamp: Number(c.timestamp)
  };
}
function toBalanceN(b) {
  return {
    immature: Number(b.immature),
    trustedPending: Number(b.trustedPending),
    untrustedPending: Number(b.untrustedPending),
    confirmed: Number(b.confirmed),
    trustedSpendable: Number(b.trustedSpendable),
    total: Number(b.total)
  };
}
function toTxDetailsN(tx) {
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
    inputs: tx.inputs.map(inp => ({
      previousTxid: inp.previousTxid,
      previousVout: inp.previousVout,
      sequence: inp.sequence,
      scriptSigHex: inp.scriptSigHex,
      witness: inp.witness
    })),
    outputs: tx.outputs.map(out => ({
      value: Number(out.value),
      scriptPubkeyHex: out.scriptPubkeyHex,
      address: out.address ?? undefined
    }))
  };
}
function toSentAndReceivedN(s) {
  return {
    sent: Number(s.sent),
    received: Number(s.received)
  };
}
function toLocalOutputN(o) {
  return {
    outpoint: o.outpoint,
    txout: {
      value: Number(o.txout.value),
      scriptPubkeyHex: o.txout.scriptPubkeyHex
    },
    keychain: o.keychain,
    isSpent: o.isSpent,
    derivationIndex: o.derivationIndex,
    confirmationBlockTime: toConfirmationN(o.confirmationBlockTime)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ElectrumClient wrapper
// ═══════════════════════════════════════════════════════════════════════════════

/** Pass a URL string (creates temp connection) or a BdkElectrumClient (reuses). */

class BdkElectrumClient {
  constructor(url) {
    this.inner = new _bdk_ffi.ElectrumClient(url);
  }
  get raw() {
    return this.inner;
  }
}
exports.BdkElectrumClient = BdkElectrumClient;
function resolveElectrum(input) {
  if (typeof input === 'string') {
    return new _bdk_ffi.ElectrumClient(input);
  }
  return input.raw;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EsploraClient wrapper
// ═══════════════════════════════════════════════════════════════════════════════

/** Pass a URL string (creates temp client) or a BdkEsploraClient (reuses). */

class BdkEsploraClient {
  constructor(url) {
    this.inner = new _bdk_ffi.EsploraClient(url);
  }
  get raw() {
    return this.inner;
  }
}
exports.BdkEsploraClient = BdkEsploraClient;
function resolveEsplora(input) {
  if (typeof input === 'string') {
    return new _bdk_ffi.EsploraClient(input);
  }
  return input.raw;
}

// Bridge the number-friendly inspector callbacks to the bigint-based FFI ones.
// Counts here fit comfortably in a JS number (well under 2^53), so the bigint
// → number conversion is lossless.
function adaptSyncInspector(inspector) {
  if (!inspector) return undefined;
  return {
    inspect: (consumed, total) => inspector.inspect(Number(consumed), Number(total))
  };
}
function adaptFullScanInspector(inspector) {
  if (!inspector) return undefined;
  return {
    inspect: (keychain, index, visited) => inspector.inspect(keychain, index, Number(visited))
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  KyotoClient wrapper (BIP157/158 light client)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Wraps a running Kyoto light client. Unlike Electrum/Esplora this owns a
 * long-lived P2P node: build it once from a wallet, reuse it across sync calls,
 * and call {@link shutdown} when done (it also stops on GC).
 */
class BdkKyotoClient {
  constructor(wallet, opts) {
    this.inner = new _bdk_ffi.KyotoClient(wallet.raw, opts.scanType, opts.requiredPeers ?? 2, opts.peers ?? [], opts.dataDir, opts.handler);
  }
  get raw() {
    return this.inner;
  }

  /** Whether the background node is still running. */
  isRunning() {
    return this.inner.isRunning();
  }

  /** Stop the node and release peer connections. */
  shutdown() {
    this.inner.shutdown();
  }
}

/** A Kyoto client is stateful, so only an existing instance can be reused. */
exports.BdkKyotoClient = BdkKyotoClient;
function resolveKyoto(input) {
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

/**
 * Wraps a Bitcoin Core RPC connection. Downloads full blocks (max privacy — the
 * node never sees the wallet's scripts) at the cost of bandwidth. Build once and
 * reuse across {@link BdkWallet.syncWithRpc} / {@link BdkWallet.broadcastWithRpc}.
 */
class BdkRpcClient {
  constructor(opts) {
    const a = opts.auth;
    this.inner = new _bdk_ffi.RpcClient(opts.url, a.type === 'userPass' ? a.username : undefined, a.type === 'userPass' ? a.password : undefined, a.type === 'cookieFile' ? a.path : undefined);
  }
  get raw() {
    return this.inner;
  }

  /** The node's current chain-tip height. */
  getBlockHeight() {
    return this.inner.getBlockHeight();
  }
}

/** An RPC client owns a connection, so only an existing instance can be reused. */
exports.BdkRpcClient = BdkRpcClient;
function resolveRpc(input) {
  return input.raw;
}

// Bridge the throttled bigint-free FFI callback to the friendly fraction object.
function adaptRpcInspector(inspector) {
  if (!inspector) return undefined;
  return {
    inspect: (currentHeight, tipHeight) => {
      const current = Number(currentHeight);
      const tip = Number(tipHeight);
      const progress = tip > 0 ? Math.min(1, current / tip) : 0;
      inspector.inspect({
        currentHeight: current,
        tipHeight: tip,
        progress
      });
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Async wallet factory
// ═══════════════════════════════════════════════════════════════════════════════

async function bdkCreateWallet(descriptor, changeDescriptor, network, dbPath) {
  const inner = await (0, _bdk_ffi.createWallet)(descriptor, changeDescriptor, network, dbPath);
  return BdkWallet.fromRaw(inner);
}
async function bdkCreateWalletFromMultipath(descriptor, network, dbPath) {
  const inner = await (0, _bdk_ffi.createWalletFromMultipath)(descriptor, network, dbPath);
  return BdkWallet.fromRaw(inner);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Wallet wrapper
// ═══════════════════════════════════════════════════════════════════════════════

class BdkWallet {
  constructor(descriptor, changeDescriptor, network, dbPath) {
    this.inner = new _bdk_ffi.Wallet(descriptor, changeDescriptor, network, dbPath);
  }
  static fromRaw(wallet) {
    const instance = Object.create(BdkWallet.prototype);
    instance.inner = wallet;
    return instance;
  }
  static fromMultipath(descriptor, network, dbPath) {
    return BdkWallet.fromRaw(_bdk_ffi.Wallet.newFromMultipath(descriptor, network, dbPath));
  }
  get raw() {
    return this.inner;
  }

  // ── Address management ──────────────────────────────────────────────────

  nextUnusedAddress(keychain) {
    return this.inner.nextUnusedAddress(keychain);
  }
  revealNextAddress(keychain) {
    return this.inner.revealNextAddress(keychain);
  }
  revealAddressesTo(keychain, index) {
    return this.inner.revealAddressesTo(keychain, index);
  }
  peekAddress(keychain, index) {
    return this.inner.peekAddress(keychain, index);
  }
  listUnusedAddresses(keychain) {
    return this.inner.listUnusedAddresses(keychain);
  }
  markUsed(keychain, index) {
    return this.inner.markUsed(keychain, index);
  }
  unmarkUsed(keychain, index) {
    return this.inner.unmarkUsed(keychain, index);
  }

  // ── Balance ─────────────────────────────────────────────────────────────

  getBalance() {
    return toBalanceN(this.inner.getBalance());
  }

  // ── UTXOs ───────────────────────────────────────────────────────────────

  listUnspent() {
    return this.inner.listUnspent().map(toLocalOutputN);
  }
  listOutput() {
    return this.inner.listOutput().map(toLocalOutputN);
  }
  getUtxo(outpoint) {
    const o = this.inner.getUtxo(outpoint);
    return o ? toLocalOutputN(o) : undefined;
  }
  insertTxout(outpoint, txout) {
    this.inner.insertTxout(outpoint, {
      value: BigInt(txout.value),
      scriptPubkeyHex: txout.scriptPubkeyHex
    });
  }

  // ── Transactions ────────────────────────────────────────────────────────

  transactions() {
    return this.inner.transactions().map(toTxDetailsN);
  }
  txDetails(txid) {
    const tx = this.inner.txDetails(txid);
    return tx ? toTxDetailsN(tx) : undefined;
  }
  getTx(txid) {
    return this.inner.getTx(txid);
  }
  sentAndReceived(txHex) {
    return toSentAndReceivedN(this.inner.sentAndReceived(txHex));
  }
  calculateFee(txHex) {
    return Number(this.inner.calculateFee(txHex));
  }
  calculateFeeRate(txHex) {
    return this.inner.calculateFeeRate(txHex);
  }

  // ── PSBT / Signing ──────────────────────────────────────────────────────

  sign(psbt) {
    return this.inner.sign(psbt);
  }
  finalizePsbt(psbt) {
    return this.inner.finalizePsbt(psbt);
  }

  // ── Sync (Esplora) ─────────────────────────────────────────────────────

  fullScanWithEsplora(client, stopGap, inspector) {
    return this.inner.fullScanWithEsplora(resolveEsplora(client), BigInt(stopGap), adaptFullScanInspector(inspector));
  }
  syncWithEsplora(client, stopGap, inspector) {
    return this.inner.syncWithEsplora(resolveEsplora(client), BigInt(stopGap), adaptSyncInspector(inspector));
  }

  // ── Sync (Electrum) ────────────────────────────────────────────────────

  fullScanWithElectrum(client, stopGap, inspector) {
    return this.inner.fullScanWithElectrum(resolveElectrum(client), BigInt(stopGap), adaptFullScanInspector(inspector));
  }
  syncWithElectrum(client, stopGap, inspector) {
    return this.inner.syncWithElectrum(resolveElectrum(client), BigInt(stopGap), adaptSyncInspector(inspector));
  }

  // ── Sync (Bitcoin Core RPC) ─────────────────────────────────────────────

  /**
   * Sync against a Bitcoin Core node by downloading full blocks from
   * `startHeight` to the node's tip. Use the wallet's birthday height for
   * `startHeight` on first sync; it acts as a floor once the wallet has a
   * checkpoint. `fetchMempool` (default true) also applies unconfirmed txs.
   */
  syncWithRpc(client, startHeight, opts) {
    return this.inner.syncWithRpc(resolveRpc(client), startHeight, opts?.fetchMempool ?? true, adaptRpcInspector(opts?.inspector));
  }

  // ── Broadcast ───────────────────────────────────────────────────────────

  broadcastWithEsplora(client, psbt) {
    return this.inner.broadcastWithEsplora(resolveEsplora(client), psbt);
  }
  broadcastWithElectrum(client, psbt) {
    return this.inner.broadcastWithElectrum(resolveElectrum(client), psbt);
  }
  broadcastWithRpc(client, psbt) {
    return this.inner.broadcastWithRpc(resolveRpc(client), psbt);
  }

  // ── Sync / Broadcast (Kyoto) ────────────────────────────────────────────

  /** Drives one sync against the Kyoto node; resolves once caught up to tip. */
  syncWithKyoto(client) {
    return this.inner.syncWithKyoto(resolveKyoto(client));
  }
  broadcastWithKyoto(client, psbt) {
    return this.inner.broadcastWithKyoto(resolveKyoto(client), psbt);
  }

  // ── Convenience (Esplora) ───────────────────────────────────────────────

  send(address, amountSats, feeRate, esplora) {
    return this.inner.send(address, BigInt(amountSats), feeRate, resolveEsplora(esplora));
  }
  drain(address, feeRate, esplora) {
    return this.inner.drain(address, feeRate, resolveEsplora(esplora));
  }

  // ── Convenience (Electrum) ──────────────────────────────────────────────

  sendWithElectrum(address, amountSats, feeRate, client) {
    return this.inner.sendWithElectrum(address, BigInt(amountSats), feeRate, resolveElectrum(client));
  }
  drainWithElectrum(address, feeRate, client) {
    return this.inner.drainWithElectrum(address, feeRate, resolveElectrum(client));
  }

  // ── Fee bumping ─────────────────────────────────────────────────────────

  buildFeeBump(txid, newFeeRate) {
    return this.inner.buildFeeBump(txid, newFeeRate);
  }

  // ── Script / SPK queries ────────────────────────────────────────────────

  /** Throws BdkError on invalid hex. */
  isMine(scriptHex) {
    return this.inner.isMine(scriptHex);
  }

  /** Throws BdkError on invalid hex. */
  derivationOfSpk(scriptHex) {
    return this.inner.derivationOfSpk(scriptHex);
  }

  // ── Descriptor / keychain info ──────────────────────────────────────────

  publicDescriptor(keychain) {
    return this.inner.publicDescriptor(keychain);
  }
  descriptorChecksum(keychain) {
    return this.inner.descriptorChecksum(keychain);
  }
  keychains() {
    return this.inner.keychains();
  }
  policies(keychain) {
    return this.inner.policies(keychain);
  }
  derivationIndex(keychain) {
    return this.inner.derivationIndex(keychain);
  }
  nextDerivationIndex(keychain) {
    return this.inner.nextDerivationIndex(keychain);
  }

  // ── Chain state ─────────────────────────────────────────────────────────

  latestCheckpoint() {
    return this.inner.latestCheckpoint();
  }
  checkpoints() {
    return this.inner.checkpoints();
  }

  // ── Persistence ─────────────────────────────────────────────────────────

  persist() {
    return this.inner.persist();
  }

  // ── Accessors ───────────────────────────────────────────────────────────

  network() {
    return this.inner.network();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TxBuilder wrapper
// ═══════════════════════════════════════════════════════════════════════════════
exports.BdkWallet = BdkWallet;
class BdkTxBuilder {
  constructor() {
    this.inner = new _bdk_ffi.TxBuilder();
  }
  get raw() {
    return this.inner;
  }
  addRecipient(address, amountSats) {
    this.inner.addRecipient(address, BigInt(amountSats));
  }
  setRecipients(recipients) {
    this.inner.setRecipients(recipients.map(r => ({
      address: r.address,
      amountSats: BigInt(r.amountSats)
    })));
  }
  addData(data) {
    this.inner.addData(new Uint8Array(data).buffer);
  }
  feeRate(satPerVbyte) {
    this.inner.feeRate(satPerVbyte);
  }
  feeAbsolute(feeSats) {
    this.inner.feeAbsolute(BigInt(feeSats));
  }
  drainWallet() {
    this.inner.drainWallet();
  }
  drainTo(address) {
    this.inner.drainTo(address);
  }
  manuallySelectedOnly() {
    this.inner.manuallySelectedOnly();
  }
  addUtxo(outpoint) {
    this.inner.addUtxo(outpoint);
  }
  addUtxos(outpoints) {
    this.inner.addUtxos(outpoints);
  }
  unspendable(outpoints) {
    this.inner.unspendable(outpoints);
  }
  addUnspendable(outpoint) {
    this.inner.addUnspendable(outpoint);
  }
  excludeBelowConfirmations(minConfirms) {
    this.inner.excludeBelowConfirmations(minConfirms);
  }
  excludeUnconfirmed() {
    this.inner.excludeUnconfirmed();
  }
  doNotSpendChange() {
    this.inner.doNotSpendChange();
  }
  onlySpendChange() {
    this.inner.onlySpendChange();
  }
  changePolicy(policy) {
    this.inner.changePolicy(policy);
  }
  enableRbf() {
    this.inner.enableRbf();
  }
  enableRbfWithSequence(nsequence) {
    this.inner.enableRbfWithSequence(nsequence);
  }
  setExactSequence(nsequence) {
    this.inner.setExactSequence(nsequence);
  }
  ordering(ordering) {
    this.inner.ordering(ordering);
  }
  nlocktime(lockHeight) {
    this.inner.nlocktime(lockHeight);
  }
  txVersion(version) {
    this.inner.txVersion(version);
  }
  allowDust(allow) {
    this.inner.allowDust(allow);
  }
  currentHeight(height) {
    this.inner.currentHeight(height);
  }
  onlyWitnessUtxo() {
    this.inner.onlyWitnessUtxo();
  }
  addGlobalXpubs() {
    this.inner.addGlobalXpubs();
  }
  sighash(sighashType) {
    this.inner.sighash(sighashType);
  }
  policyPath(pathMapJson, keychain) {
    this.inner.policyPath(pathMapJson, keychain);
  }
  async finish(wallet) {
    return this.inner.finish(wallet.raw);
  }
}
exports.BdkTxBuilder = BdkTxBuilder;
//# sourceMappingURL=wrapper.js.map