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

# Install Google Chrome for Storybook screenshots
if ! which google-chrome-stable &>/dev/null; then
  curl -fsSL https://dl.google.com/linux/linux_signing_key.pub \
    | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list
  apt-get update -qq
  apt-get install -y -qq google-chrome-stable
fi
