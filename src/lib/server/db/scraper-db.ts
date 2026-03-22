import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { join } from "node:path";

const SQLITE_PATH = join(import.meta.dirname, "..", "..", "..", "..", "data", "books.sqlite");

export function openScraperDb() {
  const sqlite = new Database(SQLITE_PATH);
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { casing: "snake_case" });
}
