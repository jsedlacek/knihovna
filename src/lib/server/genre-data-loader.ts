import fs from "node:fs";
import path from "node:path";
import { filterBlockedBooks } from "#@/lib/shared/config/book-block-list.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { deduplicateBooks } from "#@/lib/shared/utils/book-deduplication.ts";
import { getBooksForGenreGroup } from "#@/lib/shared/utils/genre-utils.ts";

export type GenreKey = "beletrie" | "deti" | "divadlo" | "poezie" | "ostatni";

export interface GenreData {
  books: Book[];
}

export async function loadGenreData(genreKey: GenreKey): Promise<GenreData> {
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

  // Filter and process books
  const unblockedBooks = filterBlockedBooks(books);
  const deduplicatedBooks = deduplicateBooks(unblockedBooks);
  const filteredBooks = deduplicatedBooks.filter(
    (book) => book.rating !== null && book.rating >= 4.0 && book.epubUrl,
  );

  // Get books for this genre
  const genreBooks = getBooksForGenreGroup(filteredBooks, genreKey);

  return {
    books: genreBooks,
  };
}
