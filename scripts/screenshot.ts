import puppeteer from "puppeteer-core";

const url = process.argv[2];
const output = process.argv[3] ?? "/tmp/screenshot.png";

if (!url) {
  console.error("Usage: pnpm screenshot <url> [output]");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox", "--disable-gpu"],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });
await page.screenshot({ path: output, fullPage: true });
await browser.close();

console.log(output);
