# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-10-17

Exposes the new `bdk_wallet` 3.2 APIs. No breaking changes.

### Added

- `BdkWallet.tryFinalizePsbt` — finalizes like `finalizePsbt` and also returns a per-input outcome (`FinalizePsbtOutcome`) that explains why an input was not finalized
- `BdkWallet.signWithDescriptors` — signs a PSBT with private descriptors passed per call, so the wallet itself can stay watch-only
- `BdkWallet.spendingPolicy` and `BdkWallet.policyCondition` — read the spending policy and turn a chosen path into a `Condition` (CSV / absolute timelock)
- `BdkTxBuilder.setCondition` — applies a spending path's timelocks directly. Takes precedence over `policyPath`
- `mergeConditions` — combines two `Condition`s
- Experimental `bdk-tx` transaction building: `BdkWallet.createPsbt` and `BdkWallet.replaceByFee`, configured with `BdkPsbtParams`. Both return the PSBT together with a `Finalizer`. Supports coin selection strategies (`SelectionStrategy`), spending-path assets (`SpendAssets`), maturity and anti-fee-sniping heights, per-input sequence overrides and v3 transactions. These APIs may change in future releases
- `KyotoScanType.NewWallet` — scans only from the current tip, for freshly generated wallets

### Changed

- Bumped `bdk_esplora` to 0.22.3
- Bumped `bdk_electrum` to 0.24.1
- Bumped `bdk_kyoto` to 0.18.1
- Bumped `bdk_bitcoind_rpc` to 0.22.1
- `bdk_wallet` is pinned to `~3.2.0` with the `bdk-tx` feature enabled, because its unstable APIs may break in minor releases
- Coin selection for v3 (TRUC) transactions now follows BIP-431 rule 2: unconfirmed v3 parents and non-v3 parents are no longer mixed. UTXOs added manually are not checked

### Deprecated

- `KyotoOptions.dataDir` — ignored since `bdk_kyoto` 0.18 and now optional
- `BdkWallet.sign`, `BdkWallet.policies` and `BdkTxBuilder.policyPath` keep working, but new code should prefer `signWithDescriptors`, `spendingPolicy` / `policyCondition` and `setCondition`

## [0.7.0] - 2026-09-23

### Changed

- Bumped `bdk_wallet` to 3.2.0
- Bumped `bdk_esplora` to 0.22.2
- Bumped `bdk_electrum` to 0.24.0
- Bumped `bdk_kyoto` to 0.17.1
- Bumped `uniffi` to 0.31.2
- Bumped `uniffi-bindgen-react-native` to 0.31.0-5
- Added `@ubjs/core` dependency: `uniffi-bindgen-react-native` moved its JS runtime into this package in 0.31.0-3, and the generated bindings now import from it. Installed automatically, no action needed

### Fixed

- Type declarations no longer reference `NodeJS` types, so `@types/node` is not needed with `skipLibCheck: false`

## [0.6.0] - 2026-06-27

### Added

- Multipath descriptor wallets — create or load a wallet from a single `<0;1>` descriptor via `bdkCreateWalletFromMultipath` (async) and `BdkWallet.fromMultipath` (sync)

### Changed

- Bumped `bdk_wallet` to 3.1.0

## [0.5.0] - 2026-06-16

### Added

- RPC sync backend
