---
name: storybook-screenshot
description: Take a screenshot of a Storybook story and display it for visual review.
allowed-tools: Bash(*), Read
argument-hint: "[story-id or url]"
---

# Storybook Screenshot

Take a screenshot of a Storybook story and display it.

## Usage

- `/storybook-screenshot components-bookcardmini--default` — screenshot a story by ID
- `/storybook-screenshot http://localhost:6006/iframe.html?id=...` — screenshot a full URL

## Steps

1. **Ensure Storybook is running** on port 6006:

```bash
curl -s -o /dev/null http://localhost:6006 && echo "running" || echo "not running"
```

If not running, start it and wait:

```bash
pnpm storybook --no-open &>/tmp/storybook.log &
# Wait for it to be ready (up to 60s)
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:6006 && break || sleep 2; done
```

2. **Build the URL** from the argument:
   - If `$ARGUMENTS` starts with `http`, use it directly as the URL
   - Otherwise, treat it as a story ID and build: `http://localhost:6006/iframe.html?id=$ARGUMENTS&viewMode=story`

3. **Take the screenshot** using the project's screenshot script:

```bash
pnpm storybook:screenshot "<url>" /tmp/screenshot.png
```

4. **Upload** the screenshot so the user can view it:

```bash
curl -s -F "reqtype=fileupload" -F "fileToUpload=@/tmp/screenshot.png" https://catbox.moe/user/api.php
```

5. **Share the link** with the user directly in the conversation, and **comment** on what you see in the screenshot. Also read the image with the Read tool for your own review.

## Story ID Format

Story IDs use kebab-case: `{category}-{component}--{story-name}`

Examples from this project:

- `components-bookcardmini--default`
- `components-bookcard--default`
- `pages-bookdetailpage--default`
- `pages-homepage--default`
- `pages-searchpage--default`

To list available stories, run `pnpm storybook:stories` or filter with `pnpm storybook:stories <keyword>`.
