![BDK Banner](https://github.com/Psycarlo/react-native-bdk-sdk/blob/main/assets/bdk-banner.png)

<div align="center">
  <h1>react-native-bdk-sdk</h1>
  <p>Unofficial React Native bindings for BDK</p>
</div>

<br />

A modern, lightweight, descriptor-based wallet library written in Rust! And now, on React Native using uniffi.

<br />

<div align="center">
  <a href="https://bitcoindevkit.org/">BDK Website</a> ·
  <a href="https://docs.rs/bdk_wallet/latest/bdk_wallet/">BDK Wallet</a>
</p>

## Installation

### Expo

1. Install the package

```bash
npx expo install react-native-bdk-sdk
```

2. Make sure the plugin is in `app.json`

```json
{
  "expo": {
    "plugins": ["react-native-bdk-sdk"]
  }
}
```

Warning: If you are using pnpm v10+, run pnpm approve-builds and select `react-native-bdk-sdk` to allow the postinstall script to download the prebuilt native binaries.

3. Run prebuild

```bash
npx expo prebuild
```

### Bare React Native

1. Install the package

```bash
npm install react-native-bdk-sdk
```

Note: If you are running on iOS, navigate into the `ios` folder and run `pod install`.

## License

Released under the **MIT** license — see the [LICENSE](LICENSE) file for details.