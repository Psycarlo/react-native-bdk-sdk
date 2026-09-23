# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2026-09-23

### Changed

- Bumped `bdk_wallet` to 3.2.0
- Bumped `bdk_esplora` to 0.22.2
- Bumped `bdk_electrum` to 0.24.0
- Bumped `bdk_kyoto` to 0.17.1
- Bumped `uniffi` to 0.31.2
- Bumped `uniffi-bindgen-react-native` to 0.31.0-5
- Generated bindings now import their runtime from `@ubjs/core` (renamed upstream in `uniffi-bindgen-react-native` 0.31.0-3), added as a dependency

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
