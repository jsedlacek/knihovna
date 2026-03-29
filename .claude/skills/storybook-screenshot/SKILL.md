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

1. **Take the screenshot** (starts Storybook automatically if not running):

```bash
pnpm storybook:screenshot "$ARGUMENTS" /tmp/screenshot.png
```

2. **Upload** the screenshot so the user can view it:

```bash
curl -s -F "reqtype=fileupload" -F "fileToUpload=@/tmp/screenshot.png" https://catbox.moe/user/api.php
```

3. **Share the link** with the user directly in the conversation, and **comment** on what you see in the screenshot. Also read the image with the Read tool for your own review.

## Story ID Format

Story IDs use kebab-case: `{category}-{component}--{story-name}`

Examples from this project:

- `components-bookcardmini--default`
- `components-bookcard--default`
- `pages-bookdetailpage--default`
- `pages-homepage--default`
- `pages-searchpage--default`

To list available stories, run `pnpm storybook:stories` or filter with `pnpm storybook:stories <keyword>`.
