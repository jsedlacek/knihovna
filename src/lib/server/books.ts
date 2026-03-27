import { env } from "cloudflare:workers";
import type { Author, Book, TimestampData } from "../shared/types/book-types.ts";
import { createLogger } from "./utils/logger.ts";

const log = createLogger("books");

async function fetchAsset<T>(path: string): Promise<T> {
  const response = await env.ASSETS.fetch(new URL(path, "https://assets.local"));
  return response.json() as Promise<T>;
}

export async function getBooks(): Promise<Book[]> {
  const start = performance.now();
  const books = await fetchAsset<Book[]>("data/books.json");
  log.info("getBooks", { duration: performance.now() - start, count: books.length });
  return books;
}

export async function getAuthors(): Promise<Author[]> {
  const start = performance.now();
  try {
    const authors = await fetchAsset<Author[]>("data/authors.json");
    log.info("getAuthors", { duration: performance.now() - start, count: authors.length });
    return authors;
  } catch {
    log.info("getAuthors: authors.json not found, returning empty array");
    return [];
  }
}

export async function getLastUpdated(): Promise<TimestampData> {
  return fetchAsset<TimestampData>("data/last-updated.json");
}
