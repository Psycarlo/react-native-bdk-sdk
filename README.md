# todo

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