import { spawn } from "node:child_process";

const STORYBOOK_BASE = "http://localhost:6006";

export { STORYBOOK_BASE };

export async function ensureStorybook(): Promise<void> {
  try {
    await fetch(STORYBOOK_BASE);
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
        console.error("Storybook started");
        return;
      } catch {}
    }
    console.error("Storybook failed to start");
    process.exit(1);
  }
}
