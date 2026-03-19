import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLogger } from "#@/lib/server/utils/logger.ts";

const log = createLogger("timestamp");

const TIMESTAMP_FILE = join(process.cwd(), "data", "last-updated.json");

export interface TimestampData {
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
    log.info({ timestamp: now.toISOString() }, "Timestamp saved");
  } catch (error) {
    log.error({ err: error }, "Failed to save timestamp");
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
    log.warn({ err: error }, "Could not read timestamp file");
    return null;
  }
}
