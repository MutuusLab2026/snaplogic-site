#!/bin/sh
# Rebuild assets/tailwind.css from the classes used in *.html and assets/*.js, then refresh the ?v= numbers.
# Run after adding or changing Tailwind classes:   sh tools/build-css.sh
# The Tailwind program (v3.4.19, no Node needed) is downloaded once into tools/bin/ (not committed).
set -e
cd "$(dirname "$0")/.."
TW=tools/bin/tailwindcss
if [ ! -x "$TW" ]; then
  mkdir -p tools/bin
  ARCH=$(uname -m); [ "$ARCH" = "x86_64" ] && ARCH=x64
  curl -sSL -o "$TW" "https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.19/tailwindcss-macos-$ARCH"
  chmod +x "$TW"
fi
"$TW" -c tailwind.config.js -i tools/tailwind.input.css -o assets/tailwind.css --minify
python3 tools/update-versions.py
