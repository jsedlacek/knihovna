import lastUpdatedJson from "../../../data/last-updated.json";
import { getWorkerDb } from "./db/worker-db.ts";
import { filterBlockedBooks } from "../shared/config/book-block-list.ts";
import { booksTable } from "../shared/db/schema.ts";
import { deduplicateBooks } from "../shared/utils/book-deduplication.ts";
import { sortBooksByScore } from "../shared/utils/book-scoring.ts";
import type { Book } from "../shared/types/book-types.ts";

let cachedBooks: Book[] | undefined;

export async function getBooks(): Promise<Book[]> {
  if (cachedBooks) return cachedBooks;

  const db = await getWorkerDb();
  const allBooks = db.select().from(booksTable).all();

  const unblockedBooks = filterBlockedBooks(allBooks);

  // Remove duplicate books, keeping only the newer version
  const deduplicatedBooks = deduplicateBooks(unblockedBooks);

  // Then filter books with a rating of 4.0 or higher and have EPUB download links
  const filteredBooks = deduplicatedBooks.filter(
    (book) => book.rating !== null && book.rating >= 4.0 && book.epubUrl,
  );

  // Sort all books by score
  cachedBooks = sortBooksByScore(filteredBooks);
  return cachedBooks;
}

export const lastUpdated = lastUpdatedJson;
