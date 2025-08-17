#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Book, MlpBookListing } from "#@/lib/shared/types/book-types.ts";
import {
  scrapeMlpListingPages,
  scrapeMlpBookDetails,
} from "#@/lib/server/scrapers/mlp-scraper.ts";
import { scrapeGoodreads } from "#@/lib/server/scrapers/goodreads-scraper.ts";
import { processBatch } from "#@/lib/server/utils/concurrency-utils.ts";
import {
  loadExistingBooks,
  saveBooks,
} from "#@/lib/server/utils/file-utils.ts";
import { saveScrapingTimestamp } from "#@/lib/server/utils/timestamp-utils.ts";
import { withRetry } from "#@/lib/server/utils/retry-utils.ts";
import {
  CONCURRENCY,
  RETRY_COUNT,
  RETRY_DELAY,
  RETRY_FACTOR,
  RETRY_MAX_DELAY,
} from "#@/lib/shared/config/scraper-config.ts";

/**
 * Main scraping function.
 */
async function main() {
  // 1. Parse command line arguments
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 [options]")
    .example("$0", "Normal scraping: MLP + Goodreads for new books only")
    .example(
      "$0 --force-mlp",
      "Re-scrape all MLP data, then Goodreads for missing data",
    )
    .example(
      "$0 --force-goodreads",
      "Normal MLP scraping, but re-scrape all Goodreads data",
    )
    .example("$0 --mlp-only", "Only scrape MLP data, skip Goodreads entirely")
    .example("$0 --goodreads-only", "Only scrape Goodreads for existing books")
    .example(
      "$0 --book-name 'Kafka'",
      "Re-scrape only books with 'Kafka' in the title",
    )
    .example(
      "$0 --author 'Karel Čapek'",
      "Re-scrape only books by author Karel Čapek",
    )
    .example(
      "$0 --book-name 'Война' --force-goodreads",
      "Force re-scrape Goodreads data for books with 'Война' in title",
    )
    .example(
      "$0 --author 'Tolkien' --mlp-only",
      "Re-scrape MLP data only for books by authors matching 'Tolkien'",
    )
    .example(
      "$0 --book-name 'povídky' --verbose",
      "Show which books match 'povídky' and process them",
    )
    .option("force-mlp", {
      alias: "f",
      type: "boolean",
      description:
        "Force re-scraping all books from MLP (ignore existing data)",
      default: false,
    })
    .option("force-goodreads", {
      alias: "g",
      type: "boolean",
      description:
        "Force re-scraping Goodreads data for all books (ignore existing ratings)",
      default: false,
    })
    .option("mlp-only", {
      type: "boolean",
      description: "Only scrape MLP data, skip Goodreads entirely",
      default: false,
    })
    .option("goodreads-only", {
      type: "boolean",
      description: "Only scrape Goodreads data for existing books, skip MLP",
      default: false,
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
      description:
        "Only process books by this author (case-insensitive partial match)",
    })
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Show detailed information about matching books",
      default: false,
    })
    .check((argv) => {
      if (argv["mlp-only"] && argv["goodreads-only"]) {
        throw new Error(
          "Cannot use both --mlp-only and --goodreads-only flags together",
        );
      }
      if (argv["goodreads-only"] && argv["force-mlp"]) {
        throw new Error(
          "Cannot use --goodreads-only with --force-mlp (no MLP scraping will occur)",
        );
      }
      if (argv["mlp-only"] && argv["force-goodreads"]) {
        throw new Error(
          "Cannot use --mlp-only with --force-goodreads (no Goodreads scraping will occur)",
        );
      }
      return true;
    })
    .help()
    .alias("help", "h").argv;

  console.log("🚀 Starting the scraping process...");

  if (argv.forceMlp) {
    console.log(
      "🔄 Force MLP mode: Will re-scrape all MLP books regardless of existing data.",
    );
  }
  if (argv.forceGoodreads) {
    console.log(
      "🔄 Force Goodreads mode: Will re-scrape all Goodreads data regardless of existing ratings.",
    );
  }
  if (argv.mlpOnly) {
    console.log("📚 MLP only mode: Skipping Goodreads scraping.");
  }
  if (argv.goodreadsOnly) {
    console.log("⭐ Goodreads only mode: Skipping MLP scraping.");
  }
  if (argv.bookName) {
    console.log(
      `🔍 Selective mode: Only processing books with "${argv.bookName}" in title.`,
    );
  }
  if (argv.author) {
    console.log(
      `👤 Selective mode: Only processing books by author "${argv.author}".`,
    );
  }
  if (argv.verbose) {
    console.log("📝 Verbose mode: Will show detailed matching information.");
  }

  // 2. Initialization: Load existing books into a Map for efficient updates.
  const existingBooks = await loadExistingBooks();
  const booksMap = new Map<string, Book>(
    existingBooks.map((book) => [book.detailUrl, book]),
  );
  console.log(`📚 Found ${booksMap.size} existing books.`);

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  // Helper function to check if a book matches selective criteria
  const matchesSelectiveCriteria = (book: Book): boolean => {
    if (argv.bookName) {
      const titleMatch = book.title
        .toLowerCase()
        .includes(argv.bookName.toLowerCase());
      if (!titleMatch) return false;
    }
    if (argv.author) {
      const authorMatch = book.author
        .toLowerCase()
        .includes(argv.author.toLowerCase());
      if (!authorMatch) return false;
    }
    return true;
  };

  // Log selective criteria summary
  if (argv.bookName || argv.author) {
    const matchingBooks = Array.from(booksMap.values()).filter(
      matchesSelectiveCriteria,
    );
    console.log(
      `🎯 Selective criteria matches: ${matchingBooks.length}/${booksMap.size} books qualify for processing.`,
    );

    if (argv.verbose && matchingBooks.length > 0) {
      console.log("\n📚 Matching books:");
      for (const book of matchingBooks.slice(0, 10)) {
        console.log(`  • "${book.title}" by ${book.author}`);
      }
      if (matchingBooks.length > 10) {
        console.log(`  ... and ${matchingBooks.length - 10} more books`);
      }
      console.log();
    }

    if (matchingBooks.length === 0) {
      console.log("⚠️ No books match the selective criteria. Exiting.");
      return;
    }
  }

  // 3. MLP Scraping Phase (skipped if in goodreads-only mode)
  if (!argv.goodreadsOnly) {
    console.log(" scraping MLP...");
    const basicMlpBooks: MlpBookListing[] = await scrapeMlpListingPages();

    // Add new books to the map
    let newBooksCount = 0;
    for (const basicBook of basicMlpBooks) {
      if (!booksMap.has(basicBook.detailUrl)) {
        booksMap.set(basicBook.detailUrl, {
          ...basicBook,
          subtitle: null,
          partTitle: null,
          imageUrl: null,
          description: null,
          pdfUrl: null,
          epubUrl: null,
          rating: null,
          ratingsCount: null,
          url: null,
          genres: [],
          mlpScrapedAt: null,
          goodreadsScrapedAt: null,
        });
        newBooksCount++;
      }
    }

    if (newBooksCount > 0) {
      console.log(`+ Discovered ${newBooksCount} new books from MLP.`);
    }

    // Identify books needing MLP detail scraping
    const booksNeedingMlpDetails = Array.from(booksMap.values()).filter(
      (book) => {
        // First check if book matches selective criteria
        if (!matchesSelectiveCriteria(book)) return false;

        if (argv.forceMlp) return true;
        const isOutOfDate =
          !book.mlpScrapedAt || new Date(book.mlpScrapedAt) < oneMonthAgo;
        return isOutOfDate;
      },
    );

    console.log(
      `[MLP] ${booksNeedingMlpDetails.length} books need detail scraping (new, or outdated).`,
    );

    if (booksNeedingMlpDetails.length > 0) {
      await processBatch({
        items: booksNeedingMlpDetails,
        concurrency: CONCURRENCY,
        onProgress: (progress, total, item) => {
          console.log(
            `[MLP ${progress}/${total}] Fetching details: ${item.title}`,
          );
        },
        processItem: async (book) => {
          try {
            const details = await withRetry(
              () => scrapeMlpBookDetails(book.detailUrl),
              {
                retries: RETRY_COUNT,
                delay: RETRY_DELAY,
                factor: RETRY_FACTOR,
                maxDelay: RETRY_MAX_DELAY,
                onRetry: (error, attempt) => {
                  console.warn(
                    `[RETRY ${attempt}/${RETRY_COUNT}] Failed MLP details for "${book.title}": ${error.message}`,
                  );
                },
              },
            );

            const existingBook = booksMap.get(book.detailUrl)!;
            booksMap.set(book.detailUrl, {
              ...existingBook,
              ...details,
              mlpScrapedAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error(
              `[ERROR] Failed MLP details for "${book.title}" after all retries. Skipping.`,
            );
          }
        },
      });
    }
    console.log(`✅ MLP scraping complete. Total books: ${booksMap.size}.`);
  }

  // 4. Goodreads Scraping Phase (skipped if in mlp-only mode)
  if (!argv.mlpOnly) {
    console.log(" scraping Goodreads...");
    const booksForGoodreads = Array.from(booksMap.values()).filter((book) => {
      // First check if book matches selective criteria
      if (!matchesSelectiveCriteria(book)) return false;

      if (argv.forceGoodreads) return true;
      const isOutOfDate =
        !book.goodreadsScrapedAt ||
        new Date(book.goodreadsScrapedAt) < oneMonthAgo;
      return isOutOfDate;
    });

    console.log(
      `[Goodreads] ${booksForGoodreads.length} books need processing (outdated).`,
    );

    if (booksForGoodreads.length > 0) {
      await processBatch({
        items: booksForGoodreads,
        concurrency: CONCURRENCY,
        onProgress: (progress, total, item) => {
          console.log(
            `[Goodreads ${progress}/${total}] Processing: ${item.title}`,
          );
        },
        processItem: async (book) => {
          try {
            const goodreadsData = await withRetry(() => scrapeGoodreads(book), {
              retries: RETRY_COUNT,
              delay: RETRY_DELAY,
              factor: RETRY_FACTOR,
              maxDelay: RETRY_MAX_DELAY,
              onRetry: (error, attempt) => {
                console.warn(
                  `[RETRY ${attempt}/${RETRY_COUNT}] Failed Goodreads for "${book.title}": ${error.message}`,
                );
              },
            });

            const existingBook = booksMap.get(book.detailUrl)!;
            booksMap.set(book.detailUrl, {
              ...existingBook,
              ...goodreadsData,
              goodreadsScrapedAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error(
              `[ERROR] Failed to fetch Goodreads data for "${book.title}" after all retries. Skipping.`,
            );
          }
        },
      });
    }
    console.log("✅ Goodreads scraping complete.");
  }

  // 5. Finalization
  const allBooks = Array.from(booksMap.values());
  console.log(`📚 Total books to save: ${allBooks.length}`);

  // Save the results to a JSON file
  await saveBooks(allBooks);

  // Save the timestamp of successful completion
  await saveScrapingTimestamp();

  console.log(
    `🎉 Scraping complete! Saved ${allBooks.length} total books to file.`,
  );
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
