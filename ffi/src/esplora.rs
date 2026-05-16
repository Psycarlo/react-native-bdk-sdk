use bdk_esplora::esplora_client::AsyncClient;

use crate::error::BdkError;

/// A reusable Esplora client that holds a persistent HTTP/TLS connection pool.
/// Create once, pass to multiple wallet methods to avoid re-handshaking each call.
#[derive(uniffi::Object)]
pub struct EsploraClient {
    pub(crate) inner: AsyncClient,
}

#[uniffi::export]
impl EsploraClient {
    /// Connect to an Esplora server.
    /// url: e.g. "https://blockstream.info/api" or "https://mempool.space/api"
    #[uniffi::constructor]
    pub fn new(url: String) -> Result<Self, BdkError> {
        let inner = bdk_esplora::esplora_client::Builder::new(&url)
            .build_async()
            .map_err(|e| BdkError::SyncFailed {
                message: format!("Failed to build Esplora client for '{}': {}", url, e),
            })?;
        Ok(Self { inner })
    }
}
