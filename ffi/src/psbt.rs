use std::sync::Mutex;

use bdk_wallet::bitcoin;
use bdk_wallet::bitcoin::consensus;
use bdk_wallet::psbt::PsbtUtils;

use crate::error::BdkError;
use crate::types::{self, TxOut};

pub struct Psbt {
    pub(crate) inner: Mutex<bitcoin::Psbt>,
}

impl Psbt {
    /// Deserialize from a base64-encoded string.
    pub fn new(psbt_base64: String) -> Result<Self, BdkError> {
        let psbt: bitcoin::Psbt = psbt_base64
            .parse()
            .map_err(|_| BdkError::InvalidPsbt)?;
        Ok(Self {
            inner: Mutex::new(psbt),
        })
    }

    /// Serialize to a base64-encoded string.
    pub fn to_base64(&self) -> String {
        let inner = self.inner.lock().unwrap();
        inner.to_string()
    }

    /// The unsigned txid.
    pub fn txid(&self) -> Result<String, BdkError> {
        let inner = self.inner.lock().unwrap();
        Ok(inner.unsigned_tx.compute_txid().to_string())
    }

    /// Total fee in satoshis. None if any input UTXO value is unknown.
    pub fn fee_amount(&self) -> Option<u64> {
        let inner = self.inner.lock().unwrap();
        inner.fee_amount().map(|a| a.to_sat())
    }

    /// Fee rate in sat/vbyte. None if any input UTXO value is unknown.
    pub fn fee_rate(&self) -> Option<f64> {
        let inner = self.inner.lock().unwrap();
        inner.fee_rate().map(|r| r.to_sat_per_vb_ceil() as f64)
    }

    /// Retrieve the UTXO for a given input index. Returns None if unavailable.
    pub fn get_utxo_for(&self, input_index: u64) -> Option<TxOut> {
        let inner = self.inner.lock().unwrap();
        inner
            .get_utxo_for(input_index as usize)
            .map(|txo| TxOut::from(&txo))
    }

    /// Extract the fully-signed transaction as raw hex.
    pub fn extract_tx_hex(&self) -> Result<String, BdkError> {
        let inner = self.inner.lock().unwrap();
        let tx = inner
            .clone()
            .extract_tx()
            .map_err(|_| BdkError::InvalidPsbt)?;
        Ok(types::hex::encode(&consensus::encode::serialize(&tx)))
    }
}
