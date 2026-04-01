import { execSync } from "node:child_process";
import { chromium } from "playwright-core";
import { ensureStorybook, STORYBOOK_BASE } from "./ensure-storybook.ts";

const url = process.argv[2];
const output = process.argv[3] ?? "/tmp/screenshot.png";

if (!url) {
  console.error("Usage: pnpm storybook:screenshot <url|story-id> [output]");
  process.exit(1);
}

const resolvedUrl = url.startsWith("http")
  ? url
  : `${STORYBOOK_BASE}/iframe.html?id=${url}&viewMode=story`;

await ensureStorybook();

const browser = await chromium.launch({
  executablePath: execSync(
    "which google-chrome-stable || which chromium-browser || which chromium",
    {
      encoding: "utf-8",
    },
  ).trim(),
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(resolvedUrl, { waitUntil: "networkidle" });

// Wait for the story to render actual content (not just Storybook's loading shell)
const root = page.locator("#storybook-root");
await root
  .locator("> *")
  .first()
  .waitFor({ timeout: 10000 })
  .catch(() => {});

// Screenshot the story root element to auto-crop to content
const box = await root.boundingBox();
if (box && box.width > 0 && box.height > 0) {
  const padding = 16;
  const vp = page.viewportSize() ?? { width: 1280, height: 900 };
  await page.screenshot({
    path: output,
    clip: {
      x: Math.max(0, box.x - padding),
      y: Math.max(0, box.y - padding),
      width: Math.min(box.width + padding * 2, vp.width),
      height: box.height + padding * 2,
    },
  });
} else {
  await page.screenshot({ path: output, fullPage: true });
}
await browser.close();

console.log(output);
