import fs from "node:fs";
import path from "node:path";
import {
  loadScrapingTimestamp,
  type TimestampData,
} from "#@/lib/server/utils/timestamp-utils.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatDateCzech } from "#@/lib/shared/utils/date-utils.ts";

export type Data = {
  books: Book[];
  lastUpdated: TimestampData | null;
  formattedLastUpdated: string | null;
};

export default async function data(): Promise<Data> {
  // Read the books data at build time
  const booksPath = path.join(process.cwd(), "data", "books.json");
  let books: Book[] = [];

  try {
    const booksData = fs.readFileSync(booksPath, "utf-8");
    books = JSON.parse(booksData);
  } catch (error) {
    console.warn(
      "Could not read books.json, using empty array:",
      error instanceof Error ? error.message : String(error),
    );
  }

  // Read the timestamp data at build time
  const lastUpdated = await loadScrapingTimestamp();

  // Format the date on the server to avoid hydration mismatches
  const formattedLastUpdated = lastUpdated
    ? formatDateCzech(lastUpdated.lastUpdated)
    : null;

  return {
    books,
    lastUpdated,
    formattedLastUpdated,
  };
}
