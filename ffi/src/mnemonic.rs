use std::sync::Mutex;

use bip39;

use crate::error::BdkError;
use crate::types::{Language, WordCount};

pub struct Mnemonic {
    inner: Mutex<bip39::Mnemonic>,
}

impl Mnemonic {
    /// Generate a new random mnemonic with the given word count (English).
    pub fn new(word_count: WordCount) -> Result<Self, BdkError> {
        let mut entropy = vec![0u8; word_count.entropy_bytes()];
        use bdk_wallet::bitcoin::key::rand::RngCore;
        bdk_wallet::bitcoin::key::rand::thread_rng().fill_bytes(&mut entropy);
        let mnemonic = bip39::Mnemonic::from_entropy(&entropy)
            .map_err(|_| BdkError::InvalidEntropy)?;
        Ok(Self {
            inner: Mutex::new(mnemonic),
        })
    }

    /// Parse an existing mnemonic string (auto-detects language).
    pub fn from_string(mnemonic: String) -> Result<Self, BdkError> {
        let m: bip39::Mnemonic = mnemonic
            .parse()
            .map_err(|_| BdkError::InvalidMnemonic)?;
        Ok(Self {
            inner: Mutex::new(m),
        })
    }

    /// Parse a mnemonic string in a specific language.
    pub fn from_string_in(mnemonic: String, language: Language) -> Result<Self, BdkError> {
        let lang: bip39::Language = language.into();
        let m = bip39::Mnemonic::parse_in(lang, &mnemonic)
            .map_err(|_| BdkError::InvalidMnemonic)?;
        Ok(Self {
            inner: Mutex::new(m),
        })
    }

    /// Create a mnemonic from raw entropy bytes (16–32 bytes).
    pub fn from_entropy(entropy: Vec<u8>) -> Result<Self, BdkError> {
        let m = bip39::Mnemonic::from_entropy(&entropy)
            .map_err(|_| BdkError::InvalidEntropy)?;
        Ok(Self {
            inner: Mutex::new(m),
        })
    }

    /// Create a mnemonic from raw entropy bytes in a specific language.
    pub fn from_entropy_in(entropy: Vec<u8>, language: Language) -> Result<Self, BdkError> {
        let lang: bip39::Language = language.into();
        let m = bip39::Mnemonic::from_entropy_in(lang, &entropy)
            .map_err(|_| BdkError::InvalidEntropy)?;
        Ok(Self {
            inner: Mutex::new(m),
        })
    }

    /// The mnemonic as a space-separated word string.
    pub fn to_string(&self) -> String {
        let inner = self.inner.lock().unwrap();
        inner.to_string()
    }

    /// Derive the 64-byte seed as hex. Pass an empty string for no passphrase.
    pub fn to_seed_hex(&self, passphrase: String) -> String {
        let inner = self.inner.lock().unwrap();
        let seed = inner.to_seed(&passphrase);
        crate::types::hex::encode(&seed)
    }

    /// Number of words (12, 15, 18, 21, or 24).
    pub fn word_count(&self) -> u32 {
        let inner = self.inner.lock().unwrap();
        inner.word_count() as u32
    }

    /// The language of this mnemonic.
    pub fn language(&self) -> Language {
        let inner = self.inner.lock().unwrap();
        inner.language().into()
    }

    /// List the individual words.
    pub fn words(&self) -> Vec<String> {
        let inner = self.inner.lock().unwrap();
        inner
            .words()
            .map(|w| w.to_string())
            .collect()
    }

    /// Get a reference to the inner bip39::Mnemonic (for internal use).
    pub(crate) fn inner(&self) -> std::sync::MutexGuard<'_, bip39::Mnemonic> {
        self.inner.lock().unwrap()
    }
}
