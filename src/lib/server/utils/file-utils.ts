import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { OUTPUT_FILE } from "#@/lib/server/config.ts";

/**
 * Load existing books from the output file if it exists.
 */
export async function loadExistingBooks(): Promise<Book[]> {
  if (!existsSync(OUTPUT_FILE)) {
    console.log("No existing data file found. Starting fresh scrape.");
    return [];
  }

  try {
    const fileContent = await readFile(OUTPUT_FILE, "utf-8");
    const existingBooks: Book[] = JSON.parse(fileContent);
    console.log(
      `📚 Loaded ${existingBooks.length} existing books from ${OUTPUT_FILE}`,
    );
    return existingBooks;
  } catch (error) {
    console.error("Error loading existing data file:", error);
    console.log("Starting fresh scrape.");
    return [];
  }
}

/**
 * Save books to the output file.
 */
export async function saveBooks(books: Book[]): Promise<void> {
  try {
    // Ensure the directory exists before writing the file
    const outputDir = dirname(OUTPUT_FILE);
    await mkdir(outputDir, { recursive: true });

    await writeFile(OUTPUT_FILE, JSON.stringify(books, null, 2));
    console.log(
      `✅ Successfully saved ${books.length} books to ${OUTPUT_FILE}`,
    );
  } catch (error) {
    console.error("❌ Failed to write output file:", error);
    throw error;
  }
}

/**
 * Create a map of existing books by detailUrl for fast lookup.
 */
export function createBookMap(books: Book[]): Map<string, Book> {
  return new Map(books.map((book) => [book.detailUrl, book]));
}

/**
 * Merge new books with existing books, avoiding duplicates.
 */
export function mergeBooks(
  existingBooks: Book[],
  newBooks: Book[],
  options: { forceMlp?: boolean; goodreadsOnly?: boolean } = {},
): Book[] {
  let existingBooksMap: Map<string, Book>;

  if (options.forceMlp || options.goodreadsOnly) {
    // In force MLP mode or goodreads-only mode, start fresh or use existing as base
    existingBooksMap = options.goodreadsOnly
      ? new Map(existingBooks.map((book) => [book.detailUrl, book]))
      : new Map();
  } else {
    // Normal mode: preserve existing books
    existingBooksMap = new Map(
      existingBooks.map((book) => [book.detailUrl, book]),
    );
  }

  // Add new books to the map, overwriting any existing entries
  for (const newBook of newBooks) {
    existingBooksMap.set(newBook.detailUrl, newBook);
  }

  return Array.from(existingBooksMap.values());
}
