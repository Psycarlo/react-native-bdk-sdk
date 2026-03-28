"use strict";

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

import { ElectrumClient, TxBuilder, Wallet, createWallet as rawCreateWallet } from "./generated/bdk_ffi.js";

// ═══════════════════════════════════════════════════════════════════════════════
//  Number-friendly output types
// ═══════════════════════════════════════════════════════════════════════════════

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
    txHex: tx.txHex,
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

export class BdkElectrumClient {
  constructor(url) {
    this.inner = new ElectrumClient(url);
  }
  get raw() {
    return this.inner;
  }
}
function resolveElectrum(input) {
  if (typeof input === 'string') {
    return new ElectrumClient(input);
  }
  return input.raw;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Async wallet factory
// ═══════════════════════════════════════════════════════════════════════════════

export async function bdkCreateWallet(descriptor, changeDescriptor, network, dbPath) {
  const inner = await rawCreateWallet(descriptor, changeDescriptor, network, dbPath);
  return BdkWallet.fromRaw(inner);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Wallet wrapper
// ═══════════════════════════════════════════════════════════════════════════════

export class BdkWallet {
  constructor(descriptor, changeDescriptor, network, dbPath) {
    this.inner = new Wallet(descriptor, changeDescriptor, network, dbPath);
  }
  static fromRaw(wallet) {
    const instance = Object.create(BdkWallet.prototype);
    instance.inner = wallet;
    return instance;
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
  cancelTx(txHex) {
    this.inner.cancelTx(txHex);
  }

  // ── PSBT / Signing ──────────────────────────────────────────────────────

  sign(psbt) {
    return this.inner.sign(psbt);
  }
  finalizePsbt(psbt) {
    return this.inner.finalizePsbt(psbt);
  }

  // ── Sync (Esplora) ─────────────────────────────────────────────────────

  fullScanWithEsplora(url, stopGap) {
    return this.inner.fullScanWithEsplora(url, BigInt(stopGap));
  }
  syncWithEsplora(url, stopGap) {
    return this.inner.syncWithEsplora(url, BigInt(stopGap));
  }

  // ── Sync (Electrum) ────────────────────────────────────────────────────

  fullScanWithElectrum(client, stopGap) {
    return this.inner.fullScanWithElectrum(resolveElectrum(client), BigInt(stopGap));
  }
  syncWithElectrum(client, stopGap) {
    return this.inner.syncWithElectrum(resolveElectrum(client), BigInt(stopGap));
  }

  // ── Broadcast ───────────────────────────────────────────────────────────

  broadcastWithEsplora(url, psbt) {
    return this.inner.broadcastWithEsplora(url, psbt);
  }
  broadcastWithElectrum(client, psbt) {
    return this.inner.broadcastWithElectrum(resolveElectrum(client), psbt);
  }

  // ── Convenience (Esplora) ───────────────────────────────────────────────

  send(address, amountSats, feeRate, esploraUrl) {
    return this.inner.send(address, BigInt(amountSats), feeRate, esploraUrl);
  }
  drain(address, feeRate, esploraUrl) {
    return this.inner.drain(address, feeRate, esploraUrl);
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

  isMine(scriptHex) {
    return this.inner.isMine(scriptHex);
  }
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

export class BdkTxBuilder {
  constructor() {
    this.inner = new TxBuilder();
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
    this.inner.addData(data);
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
  includeOutputRedeemWitnessScript() {
    this.inner.includeOutputRedeemWitnessScript();
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
//# sourceMappingURL=wrapper.js.map