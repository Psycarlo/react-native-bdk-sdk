import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { version, Mnemonic, WordCount } from 'react-native-bdk-sdk';

export default function App() {
  const [words, setWords] = useState<string[]>([]);

  const generateMnemonic = () => {
    try {
      const mnemonic = new Mnemonic(WordCount.Words12);
      setWords(mnemonic.words());
    } catch (e) {
      setWords([`Error: ${e}`]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BDK Version: {version()}</Text>
      <TouchableOpacity style={styles.button} onPress={generateMnemonic}>
        <Text style={styles.buttonText}>Generate Mnemonic</Text>
      </TouchableOpacity>
      {words.length > 0 && (
        <View style={styles.wordsContainer}>
          {words.map((word, i) => (
            <Text key={i} style={styles.word}>
              {i + 1}. {word}
            </Text>
          ))}
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F7931A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  wordsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  word: {
    fontSize: 14,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
