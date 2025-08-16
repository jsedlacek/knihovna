import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const TIMESTAMP_FILE = join(process.cwd(), "data", "last-updated.json");

interface TimestampData {
  lastUpdated: string;
  timestamp: number;
}

/**
 * Save the current timestamp to indicate when scraping was last completed.
 */
export async function saveScrapingTimestamp(): Promise<void> {
  const now = new Date();
  const timestampData: TimestampData = {
    lastUpdated: now.toISOString(),
    timestamp: now.getTime(),
  };

  try {
    await writeFile(TIMESTAMP_FILE, JSON.stringify(timestampData, null, 2));
    console.log(`✅ Timestamp saved: ${now.toISOString()}`);
  } catch (error) {
    console.error("❌ Failed to save timestamp:", error);
    // Don't throw - timestamp is not critical for scraping operation
  }
}

/**
 * Load the last scraping timestamp if it exists.
 */
export async function loadScrapingTimestamp(): Promise<TimestampData | null> {
  if (!existsSync(TIMESTAMP_FILE)) {
    return null;
  }

  try {
    const fileContent = await readFile(TIMESTAMP_FILE, "utf-8");
    const timestampData: TimestampData = JSON.parse(fileContent);
    return timestampData;
  } catch (error) {
    console.warn("Warning: Could not read timestamp file:", error);
    return null;
  }
}

/**
 * Format timestamp for Czech locale display.
 */
export function formatTimestampCzech(timestamp: TimestampData): string {
  const date = new Date(timestamp.lastUpdated);
  return date.toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
