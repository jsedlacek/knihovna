#!/usr/bin/env node

/**
 * Generate mock data files for CI environments where the real data/ directory doesn't exist.
 * This script creates minimal valid JSON files that match the expected structure.
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const DATA_DIR = "data";
const BOOKS_FILE = `${DATA_DIR}/books.json`;
const LAST_UPDATED_FILE = `${DATA_DIR}/last-updated.json`;

async function ensureDirectoryExists(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function generateMockBooks() {
  // Create a minimal mock book that matches the Book interface
  const mockBooks = [
    {
      // MlpBookListing fields
      title: "Mock Book",
      author: "Mock Author",
      publisher: "Mock Publisher",
      year: 2024,
      detailUrl: "https://example.com/mock-book",

      // MlpBookDetails fields
      subtitle: null,
      partTitle: null,
      imageUrl: null,
      description: "Mock description for testing purposes",
      pdfUrl: null,
      epubUrl: "https://example.com/mock-book.epub",
      genreId: "A1",
      genre: "Mock Genre",

      // GoodreadsData fields
      rating: 4.0,
      ratingsCount: 10,
      url: "https://goodreads.com/mock-book",

      // Timestamp fields
      mlpScrapedAt: new Date().toISOString(),
      goodreadsScrapedAt: new Date().toISOString(),
    },
  ];

  await ensureDirectoryExists(BOOKS_FILE);
  await writeFile(BOOKS_FILE, JSON.stringify(mockBooks, null, 2));
  console.log(`Created mock ${BOOKS_FILE}`);
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

  if (!isCI && (existsSync(BOOKS_FILE) || existsSync(LAST_UPDATED_FILE))) {
    console.log("Not in CI environment and data files exist - skipping mock generation");
    return;
  }

  // Only generate mock files if they don't already exist
  if (!existsSync(BOOKS_FILE)) {
    await generateMockBooks();
  } else {
    console.log(`${BOOKS_FILE} already exists, skipping mock generation`);
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
