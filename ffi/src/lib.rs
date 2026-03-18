pub mod error;
pub mod mnemonic;
pub mod psbt;
pub mod tx_builder;
pub mod types;
pub mod wallet;

pub use error::*;
pub use mnemonic::*;
pub use psbt::*;
pub use tx_builder::*;
pub use types::*;
pub use wallet::*;

use std::sync::Arc;

use bdk_wallet::bitcoin::{self, Address};
use bdk_wallet::descriptor::IntoWalletDescriptor;
use bdk_wallet::keys::{DerivableKey, ExtendedKey};
use bdk_wallet::template::{
    Bip44, Bip44Public, Bip49, Bip49Public, Bip84, Bip84Public, Bip86, Bip86Public,
    P2Pkh, P2TR, P2Wpkh, P2Wpkh_P2Sh,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  NAMESPACE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/// Runtime version of the bdk_wallet crate.
pub fn version() -> String {
    bdk_wallet::version().to_string()
}

/// Returns true if the address string is valid for the given network.
pub fn is_valid_address(address: String, network: Network) -> bool {
    let net: bitcoin::Network = network.into();
    address
        .parse::<Address<bitcoin::address::NetworkUnchecked>>()
        .map(|a| a.require_network(net).is_ok())
        .unwrap_or(false)
}

/// Generate an output descriptor string from a mnemonic using a standard BIP template.
pub fn create_descriptor(
    mnemonic: Arc<Mnemonic>,
    template: DescriptorTemplate,
    keychain: KeychainKind,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let m = mnemonic.inner();
    let xkey: ExtendedKey = m.clone().into_extended_key().map_err(|_| BdkError::KeyError)?;
    let xprv = xkey
        .into_xprv(net)
        .ok_or(BdkError::KeyError)?;

    let kc: bdk_wallet::KeychainKind = keychain.into();
    let secp = bitcoin::secp256k1::Secp256k1::new();

    let descriptor_str = match (template, kc) {
        (DescriptorTemplate::BIP44, bdk_wallet::KeychainKind::External) => {
            Bip44(xprv, kc).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        (DescriptorTemplate::BIP44, _) => {
            Bip44(xprv, kc).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        (DescriptorTemplate::BIP49, _) => {
            Bip49(xprv, kc).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        (DescriptorTemplate::BIP84, _) => {
            Bip84(xprv, kc).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        (DescriptorTemplate::BIP86, _) => {
            Bip86(xprv, kc).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Generate a public (watch-only) descriptor from an xpub string.
pub fn create_public_descriptor(
    xpub: String,
    template: DescriptorTemplate,
    keychain: KeychainKind,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let kc: bdk_wallet::KeychainKind = keychain.into();
    let secp = bitcoin::secp256k1::Secp256k1::new();

    let xpub_key: bitcoin::bip32::Xpub = xpub
        .parse()
        .map_err(|_| BdkError::KeyError)?;

    // Use fingerprint [00000000] with empty origin for public templates
    let descriptor_str = match template {
        DescriptorTemplate::BIP44 => {
            Bip44Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        DescriptorTemplate::BIP49 => {
            Bip49Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        DescriptorTemplate::BIP84 => {
            Bip84Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        DescriptorTemplate::BIP86 => {
            Bip86Public(xpub_key, Default::default(), kc)
                .into_wallet_descriptor(&secp, net)?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Generate a single-key descriptor from a key string.
pub fn create_single_key_descriptor(
    key: String,
    template: SingleKeyDescriptorTemplate,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let secp = bitcoin::secp256k1::Secp256k1::new();

    // Try parsing as WIF private key
    let pk: bitcoin::PrivateKey = key.parse().map_err(|_| BdkError::KeyError)?;

    let descriptor_str = match template {
        SingleKeyDescriptorTemplate::P2Pkh => {
            P2Pkh(pk).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        SingleKeyDescriptorTemplate::P2Wpkh => {
            P2Wpkh(pk).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        SingleKeyDescriptorTemplate::P2Wpkh_P2Sh => {
            P2Wpkh_P2Sh(pk).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
        SingleKeyDescriptorTemplate::P2TR => {
            P2TR(pk).into_wallet_descriptor(&secp, net)?.0.to_string()
        }
    };

    Ok(descriptor_str)
}

/// Compute a deterministic wallet name from its descriptors.
pub fn wallet_name_from_descriptor(
    descriptor: String,
    change_descriptor: Option<String>,
    network: Network,
) -> Result<String, BdkError> {
    let net: bitcoin::Network = network.into();
    let secp = bitcoin::secp256k1::Secp256k1::new();

    let name = bdk_wallet::wallet_name_from_descriptor(
        &descriptor,
        change_descriptor.as_ref(),
        net,
        &secp,
    )
    .map_err(|_| BdkError::InvalidDescriptor)?;

    Ok(name)
}

/// Export a wallet in FullyNoded-compatible JSON format for backup.
pub fn export_wallet(
    wallet: Arc<Wallet>,
    label: String,
    include_block_height: bool,
) -> Result<String, BdkError> {
    let w = wallet.inner.lock().unwrap();
    let export = bdk_wallet::export::FullyNodedExport::export_wallet(&*w, &label, include_block_height)
        .map_err(|_| BdkError::Generic)?;
    Ok(export.to_string())
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UNIFFI SCAFFOLDING
// ═══════════════════════════════════════════════════════════════════════════════

uniffi::include_scaffolding!("bdk");
