import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  AUTHORS_OUTPUT_FILE,
  OUTPUT_FILE,
  RAW_AUTHORS_FILE,
  RAW_OUTPUT_FILE,
} from "#@/lib/server/config.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import type { Author, Book } from "#@/lib/shared/types/book-types.ts";

const log = createLogger("file-utils");

/**
 * Load existing raw books from the raw output file if it exists.
 */
export async function loadExistingBooks(): Promise<Book[]> {
  if (!existsSync(RAW_OUTPUT_FILE)) {
    log.info("No existing raw data file found, starting fresh scrape");
    return [];
  }

  try {
    const fileContent = await readFile(RAW_OUTPUT_FILE, "utf-8");
    const existingBooks: Book[] = JSON.parse(fileContent);
    log.info("Loaded existing books", { count: existingBooks.length, file: RAW_OUTPUT_FILE });
    return existingBooks;
  } catch (error) {
    log.error("Error loading existing data file", { err: error });
    log.info("Starting fresh scrape");
    return [];
  }
}

/**
 * Save raw books to the raw output file.
 */
export async function saveBooks(books: Book[]): Promise<void> {
  try {
    const outputDir = dirname(RAW_OUTPUT_FILE);
    await mkdir(outputDir, { recursive: true });

    await writeFile(RAW_OUTPUT_FILE, JSON.stringify(books, null, 2));
    log.info("Successfully saved raw books", { count: books.length, file: RAW_OUTPUT_FILE });
  } catch (error) {
    log.error("Failed to write raw output file", { err: error });
    throw error;
  }
}

/**
 * Save pre-processed books to the output file (ready to serve).
 */
export async function saveProcessedBooks(books: Book[]): Promise<void> {
  try {
    const outputDir = dirname(OUTPUT_FILE);
    await mkdir(outputDir, { recursive: true });

    await writeFile(OUTPUT_FILE, JSON.stringify(books));
    log.info("Successfully saved processed books", { count: books.length, file: OUTPUT_FILE });
  } catch (error) {
    log.error("Failed to write processed output file", { err: error });
    throw error;
  }
}

/**
 * Create a map of existing books by titulKey for fast lookup.
 */
export function createBookMap(books: Book[]): Map<number, Book> {
  return new Map(books.map((book) => [book.titulKey, book]));
}

/**
 * Load existing raw authors from file if it exists.
 */
export async function loadExistingAuthors(): Promise<Author[]> {
  if (!existsSync(RAW_AUTHORS_FILE)) {
    log.info("No existing raw authors file found");
    return [];
  }

  try {
    const fileContent = await readFile(RAW_AUTHORS_FILE, "utf-8");
    const authors: Author[] = JSON.parse(fileContent);
    log.info("Loaded existing authors", { count: authors.length, file: RAW_AUTHORS_FILE });
    return authors;
  } catch (error) {
    log.error("Error loading existing authors file", { err: error });
    return [];
  }
}

/**
 * Save raw authors to file.
 */
export async function saveAuthors(authors: Author[]): Promise<void> {
  const outputDir = dirname(RAW_AUTHORS_FILE);
  await mkdir(outputDir, { recursive: true });
  await writeFile(RAW_AUTHORS_FILE, JSON.stringify(authors, null, 2));
  log.info("Saved raw authors", { count: authors.length, file: RAW_AUTHORS_FILE });
}

/**
 * Save processed authors to public output file.
 */
export async function saveProcessedAuthors(authors: Author[]): Promise<void> {
  const outputDir = dirname(AUTHORS_OUTPUT_FILE);
  await mkdir(outputDir, { recursive: true });
  await writeFile(AUTHORS_OUTPUT_FILE, JSON.stringify(authors));
  log.info("Saved processed authors", { count: authors.length, file: AUTHORS_OUTPUT_FILE });
}
