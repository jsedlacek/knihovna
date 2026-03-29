import { execSync, spawn } from "node:child_process";
import { chromium } from "playwright-core";

const url = process.argv[2];
const output = process.argv[3] ?? "/tmp/screenshot.png";

if (!url) {
  console.error("Usage: pnpm storybook:screenshot <url|story-id> [output]");
  process.exit(1);
}

const STORYBOOK_PORT = 6006;
const STORYBOOK_BASE = `http://localhost:${STORYBOOK_PORT}`;

const resolvedUrl = url.startsWith("http")
  ? url
  : `${STORYBOOK_BASE}/iframe.html?id=${url}&viewMode=story`;

async function ensureStorybook(): Promise<boolean> {
  try {
    await fetch(STORYBOOK_BASE);
    return false;
  } catch {
    console.error("Starting Storybook...");
    spawn("pnpm", ["storybook", "--no-open"], {
      stdio: "ignore",
      detached: true,
    }).unref();

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        await fetch(STORYBOOK_BASE);
        return true;
      } catch {}
    }
    console.error("Storybook failed to start");
    process.exit(1);
  }
}

const wasStarted = await ensureStorybook();
if (wasStarted) {
  console.error("Storybook started");
}

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
await page.screenshot({ path: output, fullPage: true });
await browser.close();

console.log(output);
