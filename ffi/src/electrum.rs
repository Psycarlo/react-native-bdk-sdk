use std::sync::Mutex;

use bdk_electrum::BdkElectrumClient;

use crate::error::BdkError;

/// A reusable Electrum client that holds a persistent TCP/TLS connection.
/// Create once, pass to multiple wallet methods to avoid reconnecting each time.
pub struct ElectrumClient {
    pub(crate) inner: Mutex<BdkElectrumClient<bdk_electrum::electrum_client::Client>>,
}

impl ElectrumClient {
    /// Connect to an Electrum server.
    /// url: e.g. "ssl://electrum.blockstream.info:60002" or "tcp://localhost:50001"
    pub fn new(url: String) -> Result<Self, BdkError> {
        let raw = bdk_electrum::electrum_client::Client::new(&url)
            .map_err(|e| BdkError::SyncFailed {
                message: format!("Failed to connect to Electrum server '{}': {}", url, e),
            })?;
        let client = BdkElectrumClient::new(raw);
        Ok(Self {
            inner: Mutex::new(client),
        })
    }
}
