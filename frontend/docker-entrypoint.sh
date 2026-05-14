#!/bin/sh
set -eu

cd /app

STAMP_DIR="node_modules/.cache/hsu-alumni"
STAMP_FILE="$STAMP_DIR/package-lock.sha256"

needs_install=0

if [ ! -d node_modules ]; then
  needs_install=1
elif [ ! -f package-lock.json ]; then
  needs_install=1
elif [ ! -f "$STAMP_FILE" ]; then
  needs_install=1
else
  current_hash="$(sha256sum package-lock.json | awk '{print $1}')"
  saved_hash="$(cat "$STAMP_FILE" 2>/dev/null || true)"

  if [ "$current_hash" != "$saved_hash" ]; then
    needs_install=1
  fi
fi

if [ "$needs_install" -eq 1 ]; then
  echo "[frontend-entrypoint] package-lock changed or node_modules missing; running npm install..."
  npm install
fi

if [ -f package-lock.json ]; then
  mkdir -p "$STAMP_DIR"
  sha256sum package-lock.json | awk '{print $1}' > "$STAMP_FILE"
fi

exec "$@"