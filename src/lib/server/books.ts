import { env } from "cloudflare:workers";
import type { Book, TimestampData } from "../shared/types/book-types.ts";

async function fetchAsset<T>(path: string): Promise<T> {
  const response = await env.ASSETS.fetch(new URL(path, "https://assets.local"));
  return response.json() as Promise<T>;
}

export async function getBooks(): Promise<Book[]> {
  return fetchAsset<Book[]>("data/books.json");
}

export async function getLastUpdated(): Promise<TimestampData> {
  return fetchAsset<TimestampData>("data/last-updated.json");
}
