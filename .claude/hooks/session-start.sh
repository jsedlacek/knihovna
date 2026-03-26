#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install Node.js 24 if not already present
if ! node --version 2>/dev/null | grep -q "^v24\."; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs

  # Ensure /usr/bin node (v24) takes precedence over older versions
  export PATH="/usr/bin:$PATH"
  echo 'export PATH="/usr/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

# Install pnpm if not already present
if ! pnpm --version 2>/dev/null | grep -q "^10\."; then
  corepack enable
  corepack prepare pnpm@latest --activate
fi

# Install project dependencies
cd "$CLAUDE_PROJECT_DIR"
pnpm install
