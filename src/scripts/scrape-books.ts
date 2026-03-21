#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { scrapeGoodreads } from "#@/lib/server/scrapers/goodreads-scraper.ts";
import { fetchMlpBookDetails, scrapeMlpListingPages } from "#@/lib/server/scrapers/mlp-scraper.ts";
import { applyBookFixupsToArray } from "#@/lib/server/utils/book-fixup-utils.ts";
import { processBatch } from "#@/lib/server/utils/concurrency-utils.ts";
import { loadExistingBooks, saveBooks } from "#@/lib/server/utils/file-utils.ts";
import { configureLogging, createLogger } from "#@/lib/server/utils/logger.ts";
import { withRetry } from "#@/lib/server/utils/retry-utils.ts";
import { saveScrapingTimestamp } from "#@/lib/server/utils/timestamp-utils.ts";
import {
  CONCURRENCY,
  RETRY_COUNT,
  RETRY_DELAY,
  RETRY_FACTOR,
  RETRY_MAX_DELAY,
} from "#@/lib/shared/config/scraper-config.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

await configureLogging();

const log = createLogger("scraper");

/**
 * Main scraping function.
 */
async function main() {
  // 1. Parse command line arguments
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 [options]")
    .example("$0", "Normal scraping: MLP + Goodreads for outdated books")
    .example("$0 --force", "Force re-scrape all enabled stages regardless of existing data")
    .example("$0 --no-goodreads", "Scrape only MLP data, skip Goodreads entirely")
    .example("$0 --no-mlp", "Only scrape Goodreads for existing books")
    .example("$0 --book-name 'Kafka'", "Re-scrape only books with 'Kafka' in the title")
    .example("$0 --author 'Karel Čapek'", "Re-scrape only books by author Karel Čapek")
    .option("force", {
      alias: "f",
      type: "boolean",
      description: "Force re-scraping for all enabled stages (ignore existing data)",
      default: false,
    })
    .option("mlp", {
      type: "boolean",
      description: "Scrape MLP book listings and details",
      default: true,
    })
    .option("goodreads", {
      type: "boolean",
      description: "Scrape ratings and data from Goodreads",
      default: true,
    })
    .option("book-name", {
      alias: "b",
      type: "string",
      description:
        "Only process books with this text in the title (case-insensitive partial match)",
    })
    .option("author", {
      alias: "a",
      type: "string",
      description: "Only process books by this author (case-insensitive partial match)",
    })

    .check((argv) => {
      if (!argv.mlp && !argv.goodreads) {
        throw new Error("At least one scraping stage must be enabled (--mlp or --goodreads)");
      }
      return true;
    })
    .help()
    .alias("help", "h").argv;

  log.info("Starting the scraping process");

  // Show enabled stages
  const enabledStages = [];
  if (argv.mlp) enabledStages.push("MLP");
  if (argv.goodreads) enabledStages.push("Goodreads");
  log.info("Enabled stages", { stages: enabledStages });

  if (argv.force) {
    log.info("Force mode: will re-scrape all enabled stages regardless of existing data");
  }
  if (argv.bookName) {
    log.info("Selective mode: filtering by book title", { bookName: argv.bookName });
  }
  if (argv.author) {
    log.info("Selective mode: filtering by author", { author: argv.author });
  }

  // 2. Initialization: Load existing books into a Map keyed by titulKey.
  const existingBooks = await loadExistingBooks();
  const booksMap = new Map<number, Book>();

  // Migrate existing books: use titulKey if present, otherwise extract from detailUrl
  for (const book of existingBooks) {
    if (book.titulKey) {
      booksMap.set(book.titulKey, book);
    } else if (book.detailUrl) {
      const match = book.detailUrl.match(/\/(\d+)\/?$/);
      if (match) {
        const titulKey = Number(match[1]);
        booksMap.set(titulKey, { ...book, titulKey });
      }
    }
  }
  log.info("Found existing books", { count: booksMap.size });

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  // Helper function to check if a book matches selective criteria
  const matchesSelectiveCriteria = (book: Book): boolean => {
    if (argv.bookName) {
      const titleMatch = book.title.toLowerCase().includes(argv.bookName.toLowerCase());
      if (!titleMatch) return false;
    }
    if (argv.author) {
      const authorMatch = book.author.toLowerCase().includes(argv.author.toLowerCase());
      if (!authorMatch) return false;
    }
    return true;
  };

  // Log selective criteria summary
  if (argv.bookName || argv.author) {
    const matchingBooks = Array.from(booksMap.values()).filter(matchesSelectiveCriteria);
    log.info("Selective criteria matches", {
      matching: matchingBooks.length,
      total: booksMap.size,
    });
  }

  // 3. MLP Scraping Phase (listing + details combined)
  if (argv.mlp) {
    // Stage 1: Discover books via API listing
    log.info("Scraping MLP listings via API");
    const mlpListings = await scrapeMlpListingPages();

    let newBooksCount = 0;
    for (const listing of mlpListings) {
      if (!booksMap.has(listing.titulKey)) {
        booksMap.set(listing.titulKey, {
          ...listing,
          subtitle: null,
          partTitle: null,
          imageUrl: null,
          description: null,
          pdfUrl: null,
          epubUrl: null,
          genreId: null,
          genre: null,
          rating: null,
          ratingsCount: null,
          url: null,
          mlpScrapedAt: null,
          goodreadsScrapedAt: null,
        });
        newBooksCount++;
      }
    }

    if (newBooksCount > 0) {
      log.info("Discovered new books from MLP", { count: newBooksCount });
    }

    // Stage 2: Fetch details for books needing updates
    log.info("Fetching MLP book details");
    const booksNeedingDetails = Array.from(booksMap.values()).filter((book) => {
      if (!matchesSelectiveCriteria(book)) return false;
      if (argv.force) return true;
      return !book.mlpScrapedAt || new Date(book.mlpScrapedAt) < oneMonthAgo;
    });

    log.info("Books need detail scraping (new or outdated)", { count: booksNeedingDetails.length });

    if (booksNeedingDetails.length > 0) {
      await processBatch({
        items: booksNeedingDetails,
        concurrency: CONCURRENCY,
        onProgress: (progress, total, item) => {
          log.info("Fetching MLP details", { progress, total, title: item.title });
        },
        processItem: async (book) => {
          try {
            const details = await withRetry(() => fetchMlpBookDetails(book.titulKey), {
              retries: RETRY_COUNT,
              delay: RETRY_DELAY,
              factor: RETRY_FACTOR,
              maxDelay: RETRY_MAX_DELAY,
              onRetry: (error, attempt) => {
                log.warn("Retrying MLP details fetch", {
                  attempt,
                  maxRetries: RETRY_COUNT,
                  title: book.title,
                  err: error,
                });
              },
            });

            const existingBook = booksMap.get(book.titulKey);
            if (!existingBook) return;
            booksMap.set(book.titulKey, {
              ...existingBook,
              ...details,
              mlpScrapedAt: new Date().toISOString(),
            });
          } catch (error) {
            log.error("Failed MLP details after all retries, skipping", {
              title: book.title,
              err: error,
            });
          }
        },
      });
    }
    log.info("MLP scraping complete");
  }

  // 4. Apply fixups to correct known data issues (before Goodreads scraping)
  log.info("Applying book fixups");
  const booksBeforeFixups = Array.from(booksMap.values());
  const booksWithFixups = applyBookFixupsToArray(booksBeforeFixups);

  // Update the booksMap with fixed data
  booksMap.clear();
  for (const book of booksWithFixups) {
    booksMap.set(book.titulKey, book);
  }

  // 5. Goodreads Scraping Phase
  if (argv.goodreads) {
    log.info("Scraping Goodreads");
    const booksForGoodreads = Array.from(booksMap.values()).filter((book) => {
      // First check if book matches selective criteria
      if (!matchesSelectiveCriteria(book)) return false;

      if (argv.force) return true;
      const isOutOfDate =
        !book.goodreadsScrapedAt || new Date(book.goodreadsScrapedAt) < oneMonthAgo;
      return isOutOfDate;
    });

    log.info("Books need Goodreads processing (outdated)", { count: booksForGoodreads.length });

    if (booksForGoodreads.length > 0) {
      await processBatch({
        items: booksForGoodreads,
        concurrency: CONCURRENCY,
        onProgress: (progress, total, item) => {
          log.info("Processing Goodreads", { progress, total, title: item.title });
        },
        processItem: async (book) => {
          try {
            const goodreadsData = await withRetry(() => scrapeGoodreads(book), {
              retries: RETRY_COUNT,
              delay: RETRY_DELAY,
              factor: RETRY_FACTOR,
              maxDelay: RETRY_MAX_DELAY,
              onRetry: (error, attempt) => {
                log.warn("Retrying Goodreads fetch", {
                  attempt,
                  maxRetries: RETRY_COUNT,
                  title: book.title,
                  err: error,
                });
              },
            });

            const existingBook = booksMap.get(book.titulKey);
            if (!existingBook) return;
            booksMap.set(book.titulKey, {
              ...existingBook,
              ...goodreadsData,
              goodreadsScrapedAt: new Date().toISOString(),
            });
          } catch (error) {
            log.error("Failed Goodreads fetch after all retries, skipping", {
              title: book.title,
              err: error,
            });
          }
        },
      });
    }
    log.info("Goodreads scraping complete");
  }

  // 6. Finalization
  const allBooks = Array.from(booksMap.values());
  log.info("Total books to save", { count: allBooks.length });

  // Save the results to a JSON file
  await saveBooks(allBooks);

  // Save the timestamp of successful completion
  await saveScrapingTimestamp();

  log.info("Scraping complete, books saved to file", { count: allBooks.length });
}

await main();
