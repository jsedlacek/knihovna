import { env } from "cloudflare:workers";
import type { Book, TimestampData } from "../shared/types/book-types.ts";
import { filterBlockedBooks } from "../shared/config/book-block-list.ts";
import { deduplicateBooks } from "../shared/utils/book-deduplication.ts";
import { sortBooksByScore } from "../shared/utils/book-scoring.ts";

async function fetchAsset<T>(path: string): Promise<T> {
  const response = await env.ASSETS.fetch(new URL(path, "https://assets.local"));
  return response.json() as Promise<T>;
}

export async function getBooks(): Promise<Book[]> {
  const booksJson = await fetchAsset<Book[]>("data/books.json");

  const unblockedBooks = filterBlockedBooks(booksJson);
  const deduplicatedBooks = deduplicateBooks(unblockedBooks);

  const filteredBooks = deduplicatedBooks.filter(
    (book) => book.rating !== null && book.rating >= 4.0 && book.epubUrl,
  );

  return sortBooksByScore(filteredBooks);
}

export async function getLastUpdated(): Promise<TimestampData> {
  return fetchAsset<TimestampData>("data/last-updated.json");
}
