import { sql } from "drizzle-orm";
import { openScraperDb } from "#@/lib/server/db/scraper-db.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { booksTable } from "#@/lib/shared/db/schema.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

const log = createLogger("file-utils");

const BATCH_SIZE = 100;

/**
 * Load existing books from the SQLite database.
 */
export async function loadExistingBooks(): Promise<Book[]> {
  try {
    const db = openScraperDb();
    const rows = db.select().from(booksTable).all();
    log.info("Loaded existing books", { count: rows.length });
    return rows;
  } catch (error) {
    log.error("Error loading existing data", { err: error });
    log.info("Starting fresh scrape");
    return [];
  }
}

/**
 * Save books to the SQLite database using upserts.
 */
export async function saveBooks(books: Book[]): Promise<void> {
  try {
    const db = openScraperDb();

    for (let i = 0; i < books.length; i += BATCH_SIZE) {
      const batch = books.slice(i, i + BATCH_SIZE);
      db.insert(booksTable)
        .values(batch)
        .onConflictDoUpdate({
          target: booksTable.titulKey,
          set: {
            title: sql`excluded.title`,
            author: sql`excluded.author`,
            publisher: sql`excluded.publisher`,
            year: sql`excluded.year`,
            detailUrl: sql`excluded.detail_url`,
            subtitle: sql`excluded.subtitle`,
            partTitle: sql`excluded.part_title`,
            imageUrl: sql`excluded.image_url`,
            description: sql`excluded.description`,
            pdfUrl: sql`excluded.pdf_url`,
            epubUrl: sql`excluded.epub_url`,
            genreId: sql`excluded.genre_id`,
            genre: sql`excluded.genre`,
            rating: sql`excluded.rating`,
            ratingsCount: sql`excluded.ratings_count`,
            url: sql`excluded.url`,
            mlpScrapedAt: sql`excluded.mlp_scraped_at`,
            goodreadsScrapedAt: sql`excluded.goodreads_scraped_at`,
          },
        })
        .run();
    }

    log.info("Successfully saved books", { count: books.length });
  } catch (error) {
    log.error("Failed to save books", { err: error });
    throw error;
  }
}

/**
 * Create a map of existing books by titulKey for fast lookup.
 */
export function createBookMap(books: Book[]): Map<number, Book> {
  return new Map(books.map((book) => [book.titulKey, book]));
}
