pub mod electrum;
pub mod error;
pub mod esplora;
pub mod mnemonic;
pub mod psbt;
pub mod tx_builder;
pub mod types;
pub mod wallet;

pub use electrum::*;
pub use error::*;
pub use esplora::*;
pub use mnemonic::*;
pub use psbt::*;
pub use tx_builder::*;
pub use types::*;
pub use wallet::*;

use std::sync::{Arc, LazyLock};

/// Global Tokio runtime for async methods.
/// uniffi polls Rust futures without entering a Tokio runtime context,
/// so spawn_blocking() and async I/O (reqwest) would panic without this.
pub static RUNTIME: LazyLock<tokio::runtime::Runtime> = LazyLock::new(|| {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("Failed to create Tokio runtime")
});

/// Run an async future on the global Tokio runtime.
pub async fn run_async<F, T>(future: F) -> T
where
    F: std::future::Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    RUNTIME.spawn(future).await.expect("Tokio task panicked")
}

use bdk_wallet::bitcoin::{self, secp256k1, Address};
use bdk_wallet::descriptor::IntoWalletDescriptor;
use bdk_wallet::keys::{DerivableKey, ExtendedKey};
use bdk_wallet::template::{
    Bip44, Bip44Public, Bip49, Bip49Public, Bip84, Bip84Public, Bip86, Bip86Public,
    P2Pkh, P2TR, P2Wpkh, P2Wpkh_P2Sh,
};

/// Process-wide secp256k1 context. `Secp256k1::new()` allocates ~70KB of
/// precomputed tables, so reuse across descriptor / key operations.
static SECP: LazyLock<secp256k1::Secp256k1<secp256k1::All>> =
    LazyLock::new(secp256k1::Secp256k1::new);

// ═══════════════════════════════════════════════════════════════════════════════
//  NAMESPACE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/// Runtime version of the bdk_wallet crate.
#[uniffi::export]
pub fn version() -> String {
    bdk_wallet::version().to_string()
}

/// Returns true if the address string is valid for the given network.
#[uniffi::export]
pub fn is_valid_address(address: String, network: Network) -> bool {
    let net: bitcoin::Network = network.into();
    address
        .parse::<Address<bitcoin::address::NetworkUnchecked>>()
        .map(|a| a.require_network(net).is_ok())
        .unwrap_or(false)
}

/// Convert a scriptPubKey (hex) to an address string for the given network.
/// Returns the address string, or an error if the script cannot be converted.
#[uniffi::export]
pub fn address_from_script(script_hex: String, network: Network) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let bytes = types::hex::decode(&script_hex).map_err(|_| BdkError::InvalidScript {
        message: "Invalid hex encoding".into(),
    })?;
    let script = bitcoin::ScriptBuf::from_bytes(bytes);
    let addr = Address::from_script(&script, net).map_err(|e| BdkError::InvalidScript {
        message: format!("Cannot derive address from script: {}", e),
    })?;
    Ok(addr.to_string())
}

/// Validate a descriptor string for the given network without creating a wallet.
#[uniffi::export]
pub fn validate_descriptor(descriptor: String, network: Network) -> bool {
    let net: bitcoin::Network = network.into();
    descriptor
        .as_str()
        .into_wallet_descriptor(&*SECP, net.into())
        .is_ok()
}

/// Async wallet factory — creates or loads a wallet without blocking the JS thread.
/// Pass null/undefined for change_descriptor to use the main descriptor for both keychains.
#[uniffi::export(async_runtime = "tokio")]
pub async fn create_wallet(
    descriptor: String,
    change_descriptor: Option<String>,
    network: Network,
    db_path: String,
) -> Result<Arc<Wallet>, BdkError> {
    run_async(async move {
        tokio::task::spawn_blocking(move || {
            Wallet::new(descriptor, change_descriptor, network, db_path).map(Arc::new)
        })
        .await
        .map_err(|e| BdkError::WalletCreationFailed {
            message: format!("Wallet creation task panicked: {}", e),
        })?
    }).await
}

/// Generate an output descriptor string from a mnemonic using a standard BIP template.
#[uniffi::export]
pub fn create_descriptor(
    mnemonic: Arc<Mnemonic>,
    template: DescriptorTemplate,
    keychain: KeychainKind,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let m = mnemonic.inner();
    let xkey: ExtendedKey = m.clone().into_extended_key().map_err(|e| BdkError::KeyError {
        message: format!("Failed to derive extended key: {}", e),
    })?;
    let xprv = xkey
        .into_xprv(net.into())
        .ok_or(BdkError::KeyError {
            message: "Cannot derive xprv from extended key".into(),
        })?;

    let kc: bdk_wallet::KeychainKind = keychain.into();

    let descriptor_str = match (template, kc) {
        (DescriptorTemplate::BIP44, _) => {
            Bip44(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        (DescriptorTemplate::BIP49, _) => {
            Bip49(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        (DescriptorTemplate::BIP84, _) => {
            Bip84(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        (DescriptorTemplate::BIP86, _) => {
            Bip86(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Generate an output descriptor from a mnemonic string (convenience overload).
#[uniffi::export]
pub fn create_descriptor_from_string(
    mnemonic: String,
    template: DescriptorTemplate,
    keychain: KeychainKind,
    network: Network,
) -> Result<String, BdkError> {
    let m: bip39::Mnemonic = mnemonic.parse().map_err(|e: bip39::Error| BdkError::InvalidMnemonic {
        message: e.to_string(),
    })?;
    let net: bitcoin::Network = network.into();
    let xkey: ExtendedKey = m.into_extended_key().map_err(|e| BdkError::KeyError {
        message: format!("Failed to derive extended key: {}", e),
    })?;
    let xprv = xkey
        .into_xprv(net.into())
        .ok_or(BdkError::KeyError {
            message: "Cannot derive xprv from extended key".into(),
        })?;

    let kc: bdk_wallet::KeychainKind = keychain.into();

    let descriptor_str = match (template, kc) {
        (DescriptorTemplate::BIP44, _) => {
            Bip44(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        (DescriptorTemplate::BIP49, _) => {
            Bip49(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        (DescriptorTemplate::BIP84, _) => {
            Bip84(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        (DescriptorTemplate::BIP86, _) => {
            Bip86(xprv, kc).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Generate a public (watch-only) descriptor from an xpub string.
#[uniffi::export]
pub fn create_public_descriptor(
    xpub: String,
    template: DescriptorTemplate,
    keychain: KeychainKind,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let kc: bdk_wallet::KeychainKind = keychain.into();

    let xpub_key: bitcoin::bip32::Xpub = xpub
        .parse()
        .map_err(|e| BdkError::KeyError {
            message: format!("Invalid xpub: {}", e),
        })?;

    let descriptor_str = match template {
        DescriptorTemplate::BIP44 => {
            Bip44Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        DescriptorTemplate::BIP49 => {
            Bip49Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        DescriptorTemplate::BIP84 => {
            Bip84Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        DescriptorTemplate::BIP86 => {
            Bip86Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Generate a single-key descriptor from a key string.
#[uniffi::export]
pub fn create_single_key_descriptor(
    key: String,
    template: SingleKeyDescriptorTemplate,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();

    let pk: bitcoin::PrivateKey = key.parse().map_err(|e| BdkError::KeyError {
        message: format!("Invalid private key: {}", e),
    })?;

    let descriptor_str = match template {
        SingleKeyDescriptorTemplate::P2Pkh => {
            P2Pkh(pk).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        SingleKeyDescriptorTemplate::P2Wpkh => {
            P2Wpkh(pk).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        SingleKeyDescriptorTemplate::P2Wpkh_P2Sh => {
            P2Wpkh_P2Sh(pk).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
        SingleKeyDescriptorTemplate::P2TR => {
            P2TR(pk).into_wallet_descriptor(&*SECP, net.into())?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Compute a deterministic wallet name from its descriptors.
#[uniffi::export]
pub fn wallet_name_from_descriptor(
    descriptor: String,
    change_descriptor: Option<String>,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();

    let name = bdk_wallet::wallet_name_from_descriptor(
        &descriptor,
        change_descriptor.as_ref(),
        net.into(),
        &*SECP,
    )
    .map_err(|e| BdkError::InvalidDescriptor {
        message: format!("Failed to compute wallet name: {}", e),
    })?;

    Ok(name)
}

/// Export a wallet in FullyNoded-compatible JSON format for backup.
#[uniffi::export]
pub fn export_wallet(
    wallet: Arc<Wallet>,
    label: String,
    include_block_height: bool,
) -> Result<String, BdkError> {
    let w = wallet.inner.lock().unwrap();
    let export = bdk_wallet::export::FullyNodedExport::export_wallet(&*w, &label, include_block_height)
        .map_err(|e| BdkError::Generic {
            message: format!("Export failed: {}", e),
        })?;
    Ok(export.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UNIFFI SCAFFOLDING
// ═══════════════════════════════════════════════════════════════════════════════

uniffi::setup_scaffolding!();
