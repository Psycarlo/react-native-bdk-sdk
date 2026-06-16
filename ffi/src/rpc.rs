use std::path::PathBuf;
use std::sync::Mutex;

use bdk_bitcoind_rpc::bitcoincore_rpc::{Auth, Client, RpcApi};

use crate::error::BdkError;

/// A reusable Bitcoin Core JSON-RPC connection.
///
/// Unlike Electrum/Esplora (which query a third-party indexer), this talks to a
/// full node the user runs themselves and downloads *whole blocks*: the node
/// never learns which scripts belong to the wallet, so it offers the strongest
/// privacy of any backend — at the cost of bandwidth. Create once, then drive
/// sync via [`Wallet::sync_with_rpc`] and broadcast via
/// [`Wallet::broadcast_with_rpc`].
#[derive(uniffi::Object)]
pub struct RpcClient {
    pub(crate) inner: Mutex<Client>,
}

#[uniffi::export]
impl RpcClient {
    /// Connect to a Bitcoin Core node.
    ///
    /// - `url`: e.g. `"http://127.0.0.1:8332"` (mainnet) or `":18443"` for regtest.
    /// - Auth precedence: if `username` + `password` are both set, use them;
    ///   else if `cookie_file` is set, read the node's `.cookie`; else no auth.
    ///
    /// The TS wrapper exposes this as a tagged `auth` union for a nicer API.
    #[uniffi::constructor]
    pub fn new(
        url: String,
        username: Option<String>,
        password: Option<String>,
        cookie_file: Option<String>,
    ) -> Result<Self, BdkError> {
        let auth = match (username, password, cookie_file) {
            (Some(u), Some(p), _) => Auth::UserPass(u, p),
            (_, _, Some(path)) => Auth::CookieFile(PathBuf::from(path)),
            _ => Auth::None,
        };

        let client = Client::new(&url, auth).map_err(|e| BdkError::SyncFailed {
            message: format!("Failed to connect to Bitcoin Core RPC '{}': {}", url, e),
        })?;

        Ok(Self {
            inner: Mutex::new(client),
        })
    }

    /// The node's current chain-tip height. Blocks the calling thread on a
    /// single RPC round-trip (fast against a local node).
    pub fn get_block_height(&self) -> Result<u32, BdkError> {
        let client = self.inner.lock().unwrap();
        let height = client.get_block_count().map_err(|e| BdkError::SyncFailed {
            message: format!("RPC get_block_count failed: {}", e),
        })?;
        Ok(height as u32)
    }
}
