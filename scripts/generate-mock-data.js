#!/usr/bin/env node

/**
 * Generate mock data files for CI environments where the real data/ directory doesn't exist.
 * This script creates a minimal valid SQLite database and last-updated JSON file.
 */

import Database from "better-sqlite3";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const DATA_DIR = "data";
const SQLITE_FILE = `${DATA_DIR}/books.sqlite`;
const LAST_UPDATED_FILE = `${DATA_DIR}/last-updated.json`;

async function ensureDirectoryExists(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function generateMockDatabase() {
  await ensureDirectoryExists(SQLITE_FILE);

  const sqlite = new Database(SQLITE_FILE);
  sqlite.pragma("journal_mode = WAL");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS books (
      titul_key INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      publisher TEXT,
      year INTEGER,
      detail_url TEXT NOT NULL,
      subtitle TEXT,
      part_title TEXT,
      image_url TEXT,
      description TEXT,
      pdf_url TEXT,
      epub_url TEXT,
      genre_id TEXT,
      genre TEXT,
      rating REAL,
      ratings_count INTEGER,
      url TEXT,
      mlp_scraped_at TEXT,
      goodreads_scraped_at TEXT
    )
  `);

  const now = new Date().toISOString();
  sqlite
    .prepare(
      `INSERT OR IGNORE INTO books (
      titul_key, title, author, publisher, year, detail_url,
      subtitle, part_title, image_url, description, pdf_url, epub_url,
      genre_id, genre, rating, ratings_count, url,
      mlp_scraped_at, goodreads_scraped_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      9999999,
      "Mock Book",
      "Mock Author",
      "Mock Publisher",
      2024,
      "https://example.com/mock-book",
      null,
      null,
      null,
      "Mock description for testing purposes",
      null,
      "https://example.com/mock-book.epub",
      "A1",
      "Mock Genre",
      4.0,
      10,
      "https://goodreads.com/mock-book",
      now,
      now,
    );

  sqlite.close();
  console.log(`Created mock ${SQLITE_FILE}`);
}

async function generateMockLastUpdated() {
  const mockLastUpdated = {
    lastUpdated: new Date().toISOString(),
    timestamp: Date.now(),
  };

  await ensureDirectoryExists(LAST_UPDATED_FILE);
  await writeFile(LAST_UPDATED_FILE, JSON.stringify(mockLastUpdated, null, 2));
  console.log(`Created mock ${LAST_UPDATED_FILE}`);
}

async function main() {
  // Check if running in CI environment
  const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

  if (!isCI && (existsSync(SQLITE_FILE) || existsSync(LAST_UPDATED_FILE))) {
    console.log("Not in CI environment and data files exist - skipping mock generation");
    return;
  }

  // Only generate mock files if they don't already exist
  if (!existsSync(SQLITE_FILE)) {
    await generateMockDatabase();
  } else {
    console.log(`${SQLITE_FILE} already exists, skipping mock generation`);
  }

  if (!existsSync(LAST_UPDATED_FILE)) {
    await generateMockLastUpdated();
  } else {
    console.log(`${LAST_UPDATED_FILE} already exists, skipping mock generation`);
  }

  console.log("Mock data generation completed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Error generating mock data:", error);
    process.exit(1);
  });
}
