import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {
  version,
  Network,
  KeychainKind,
  DescriptorTemplate,
  BdkWallet,
  createDescriptorFromString,
} from 'react-native-bdk-sdk';

const ELECTRUM_URL = 'ssl://mempool.space:60602';

// WARNING: This is a TEST seed for signet only. Do NOT use on mainnet.
const TEST_SEED =
  'surprise winter sausage nation grape nerve cereal because price rally pride gym';

type LogEntry = { text: string; type: 'info' | 'success' | 'error' };

function useTickingCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}

function Spinner() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <Animated.View style={{ transform: [{ rotate }], marginRight: 8 }}>
      <Text style={{ fontSize: 18 }}>⟳</Text>
    </Animated.View>
  );
}

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const tick = useTickingCounter();

  const log = (text: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { text, type }]);
  };

  const clearLogs = () => setLogs([]);

  const runSyncTest = async () => {
    setRunning(true);
    clearLogs();

    try {
      // 1. Create descriptors from known test seed
      log('Creating descriptors from test seed...');
      const descriptor = createDescriptorFromString(
        TEST_SEED,
        DescriptorTemplate.Bip84,
        KeychainKind.External,
        Network.Signet
      );
      const changeDescriptor = createDescriptorFromString(
        TEST_SEED,
        DescriptorTemplate.Bip84,
        KeychainKind.Internal,
        Network.Signet
      );
      log('Descriptors created', 'success');

      // 2. Create wallet
      log('Creating wallet...');
      const wallet = new BdkWallet(
        descriptor,
        changeDescriptor,
        Network.Signet,
        '/tmp/bdk-signet-test.db'
      );
      log('Wallet created', 'success');

      // 3. Test sync methods (should work)
      log('Testing sync methods...');
      const balance = wallet.getBalance();
      log(`Balance: ${balance.total} sats`, 'success');

      const address = wallet.peekAddress(KeychainKind.External, 0);
      log(`Address: ${address.address.slice(0, 20)}...`, 'success');

      const checkpoint = wallet.latestCheckpoint();
      log(`Checkpoint: height=${checkpoint?.height}`, 'success');

      // 4. Full scan with Electrum
      log('');
      log('=== ASYNC TEST: fullScanWithElectrum ===');
      log(`URL: ${ELECTRUM_URL}`);
      log('Calling fullScanWithElectrum...');
      log('(watch the counter above — if it keeps ticking, UI is NOT blocked)');

      const start = Date.now();
      await wallet.fullScanWithElectrum(ELECTRUM_URL, 20);
      const elapsed = Date.now() - start;

      log(`fullScanWithElectrum completed in ${elapsed}ms`, 'success');

      // 5. Check balance after scan
      const newBalance = wallet.getBalance();
      log(`Balance after scan: ${newBalance.total} sats`, 'success');

      // 6. Test transactions() — previously caused deadlock
      log('');
      log('=== DEADLOCK REGRESSION TEST ===');
      log('Calling wallet.transactions()...');
      const txs = wallet.transactions();
      log(`transactions() returned ${txs.length} txs`, 'success');

      if (txs.length > 0) {
        const first = txs[0];
        log(`First tx: ${first.txid.slice(0, 16)}...`, 'success');

        // 7. Test txDetails() — also previously caused deadlock
        log('Calling wallet.txDetails()...');
        const detail = wallet.txDetails(first.txid);
        log(
          `txDetails() returned: sent=${detail?.sent} received=${detail?.received}`,
          'success'
        );
      }
    } catch (e: any) {
      const message = e?.message ?? String(e);
      log(`ERROR: ${message}`, 'error');
      log(`Stack: ${e?.stack?.slice(0, 200) ?? 'N/A'}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BDK SDK v{version()}</Text>
      <Text style={styles.subtitle}>
        RN{' '}
        {Platform.constants?.reactNativeVersion
          ? `${Platform.constants.reactNativeVersion.major}.${Platform.constants.reactNativeVersion.minor}.${Platform.constants.reactNativeVersion.patch}`
          : '?'}{' '}
        | {Platform.OS}
      </Text>

      <View style={styles.tickRow}>
        {running && <Spinner />}
        <Text style={styles.tickText}>UI tick: {tick}s</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, running && styles.buttonDisabled]}
        onPress={runSyncTest}
        disabled={running}
      >
        <Text style={styles.buttonText}>
          {running ? 'Running...' : 'Run Tests'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.logContainer}>
        {logs.map((entry, i) => (
          <Text
            key={i}
            style={[
              styles.log,
              entry.type === 'success' && styles.logSuccess,
              entry.type === 'error' && styles.logError,
            ]}
          >
            {entry.text}
          </Text>
        ))}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  tickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tickText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F7931A',
  },
  button: {
    backgroundColor: '#F7931A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logContainer: {
    flex: 1,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
  },
  log: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#ccc',
    marginBottom: 2,
  },
  logSuccess: {
    color: '#4ade80',
  },
  logError: {
    color: '#f87171',
  },
});
