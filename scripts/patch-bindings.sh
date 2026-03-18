#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# ----------------------------------------------------------------------------
#    Fix source_files globs to avoid duplicate symbol errors on RN 0.82+.
#    - ios/**/* -> ios/* (no recursive glob)
#    - ios/generated/**/*.{h,m,mm} -> ios/generated/**/*.{h} (headers only)
#    Reference: https://github.com/breez/spark-sdk/commit/84131fd4a1a154a8ede9a6570edd80a947a759cc
# ----------------------------------------------------------------------------
PODSPEC=$(find "$PROJECT_DIR" -maxdepth 1 -name "*.podspec" | head -1)
if [ -n "$PODSPEC" ]; then
  if grep -q '"ios/\*\*/\*' "$PODSPEC" || grep -q '{h,m,mm}"' "$PODSPEC"; then
    echo "  Patching $(basename "$PODSPEC")..."

    # ios/**/*.{h,m,mm,swift} -> ios/*.{h,m,mm,swift}
    sed -i.bak 's|"ios/\*\*/\*\.{h,m,mm,swift}"|"ios/*.{h,m,mm,swift}"|g' "$PODSPEC"

    # ios/generated/**/*.{h,m,mm} -> ios/generated/**/*.{h}
    sed -i.bak 's|"ios/generated/\*\*/\*\.{h,m,mm}"|"ios/generated/**/*.{h}"|g' "$PODSPEC"

    rm -f "$PODSPEC.bak"
    echo "  $(basename "$PODSPEC") patched"
  else
    echo "  $(basename "$PODSPEC") already patched, skipping"
  fi
else
  echo "  No podspec found, skipping"
fi

echo "Done."
