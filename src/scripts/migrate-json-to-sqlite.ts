import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { booksTable } from "../lib/shared/db/schema.ts";

const dataDir = join(import.meta.dirname, "..", "..", "data");
const jsonPath = join(dataDir, "books.json");
const sqlitePath = join(dataDir, "books.sqlite");

const booksJson: Record<string, unknown>[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

console.log(`Loaded ${booksJson.length} books from ${jsonPath}`);

const sqlite = new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite, { casing: "snake_case" });

// Create the table using drizzle-kit push equivalent — manually create for simplicity
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

// Insert books in batches within a transaction
const BATCH_SIZE = 100;

function mapBook(book: Record<string, unknown>) {
  return {
    titulKey: book["titulKey"] as number,
    title: book["title"] as string,
    author: book["author"] as string,
    publisher: (book["publisher"] as string | null) ?? null,
    year: (book["year"] as number | null) ?? null,
    detailUrl: book["detailUrl"] as string,
    subtitle: (book["subtitle"] as string | null) ?? null,
    partTitle: (book["partTitle"] as string | null) ?? null,
    imageUrl: (book["imageUrl"] as string | null) ?? null,
    description: (book["description"] as string | null) ?? null,
    pdfUrl: (book["pdfUrl"] as string | null) ?? null,
    epubUrl: (book["epubUrl"] as string | null) ?? null,
    genreId: (book["genreId"] as string | null) ?? null,
    genre: (book["genre"] as string | null) ?? null,
    rating: (book["rating"] as number | null) ?? null,
    ratingsCount: (book["ratingsCount"] as number | null) ?? null,
    url: (book["url"] as string | null) ?? null,
    mlpScrapedAt: (book["mlpScrapedAt"] as string | null) ?? null,
    goodreadsScrapedAt: (book["goodreadsScrapedAt"] as string | null) ?? null,
  };
}

sqlite.exec("BEGIN");
for (let i = 0; i < booksJson.length; i += BATCH_SIZE) {
  const batch = booksJson.slice(i, i + BATCH_SIZE);
  db.insert(booksTable).values(batch.map(mapBook)).run();
}
sqlite.exec("COMMIT");

console.log(`Migrated ${booksJson.length} books to ${sqlitePath}`);

sqlite.close();
