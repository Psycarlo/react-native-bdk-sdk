#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Bdk FFI React Native Bindings Generator - FOR MAINTAINERS ONLY
# ============================================================================

OS=$(uname -s)

echo "🔨 Building Bdk FFI React Native Bindings"
echo "Platform: $OS"
echo ""

if ! command -v cargo &> /dev/null; then
    echo "❌ Error: cargo not found. Install Rust from https://rustup.rs"
    exit 1
fi

if ! command -v rustc &> /dev/null; then
    echo "❌ Error: rustc not found. Install Rust from https://rustup.rs"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install --ignore-scripts

# Targets are installed from ffi/ so they go to the toolchain pinned in
# ffi/rust-toolchain.toml, which builds the bindings.
echo "📦 Ensuring Android Rust targets are installed..."
(cd ffi && rustup target add aarch64-linux-android)
(cd ffi && rustup target add armv7-linux-androideabi)
(cd ffi && rustup target add x86_64-linux-android)
(cd ffi && rustup target add i686-linux-android)

echo ""
echo "🤖 Building for Android..."
pnpm ubrn:android

# Build for iOS (macOS only)
if [ "$OS" = "Darwin" ]; then
    echo ""
    echo "📦 Ensuring iOS Rust targets are installed..."
    (cd ffi && rustup target add aarch64-apple-ios)
    (cd ffi && rustup target add x86_64-apple-ios)
    (cd ffi && rustup target add aarch64-apple-ios-sim)

    echo ""
    echo "🍎 Building for iOS..."
    pnpm ubrn:ios
else
    echo ""
    echo "⏭️  Skipping iOS build (macOS only)"
fi

echo ""
echo "🔧 Applying post-generation patches..."
bash scripts/patch-bindings.sh
echo "✅ Patches applied"

echo ""
echo "📦 Building JS bindings..."
pnpm prepare

echo ""
echo "✅ Build complete!"
