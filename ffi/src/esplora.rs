use bdk_esplora::esplora_client::AsyncClient;

use crate::error::BdkError;

/// Concurrent HTTP requests per sync or full scan when none is given.
pub const DEFAULT_ESPLORA_PARALLEL_REQUESTS: u64 = 1;

/// A reusable Esplora client that holds a persistent HTTP/TLS connection pool.
/// Create once, pass to multiple wallet methods to avoid re-handshaking each call.
#[derive(uniffi::Object)]
pub struct EsploraClient {
    pub(crate) inner: AsyncClient,
    pub(crate) parallel_requests: usize,
}

#[uniffi::export]
impl EsploraClient {
    /// Connect to an Esplora server.
    /// url: e.g. "https://blockstream.info/api" or "https://mempool.space/api"
    #[uniffi::constructor]
    pub fn new(url: String) -> Result<Self, BdkError> {
        Self::with_options(url, DEFAULT_ESPLORA_PARALLEL_REQUESTS)
    }

    /// Connect to an Esplora server, running up to `parallel_requests` HTTP
    /// requests at once in syncs and full scans.
    #[uniffi::constructor]
    pub fn with_options(url: String, parallel_requests: u64) -> Result<Self, BdkError> {
        if parallel_requests == 0 {
            return Err(BdkError::Generic {
                message: "Esplora parallel requests must be at least 1".into(),
            });
        }
        let inner = bdk_esplora::esplora_client::Builder::new(&url)
            .build_async()
            .map_err(|e| BdkError::SyncFailed {
                message: format!("Failed to build Esplora client for '{}': {}", url, e),
            })?;
        Ok(Self {
            inner,
            parallel_requests: parallel_requests as usize,
        })
    }
}
