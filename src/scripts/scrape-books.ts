#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type {
  Book,
  MlpBookListing,
  MlpBookData,
  ScrapingOptions,
  GoodreadsData,
} from "#@/lib/shared/types/book-types.ts";
import {
  scrapeMlpListingPages,
  scrapeMlpBookDetails,
} from "#@/lib/server/scrapers/mlp-scraper.ts";
import { scrapeGoodreads } from "#@/lib/server/scrapers/goodreads-scraper.ts";
import { processBatch } from "#@/lib/server/utils/concurrency-utils.ts";
import {
  loadExistingBooks,
  saveBooks,
  mergeBooks,
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
 * Determine which books need Goodreads processing.
 */
function getBooksForGoodreads(
  allMlpBooks: MlpBookData[],
  existingBooks: Book[],
  options: ScrapingOptions,
): MlpBookData[] {
  if (options.mlpOnly) {
    return [];
  }

  return allMlpBooks.filter((book) => {
    const existingBook = existingBooks.find(
      (existing) => existing.detailUrl === book.detailUrl,
    );

    if (options.forceGoodreads) {
      // Force mode: process all books
      return true;
    }

    // Normal mode: process if book doesn't exist, or exists but missing Goodreads data
    return !existingBook || (!existingBook.rating && !existingBook.url);
  });
}

/**
 * Combine MLP books with Goodreads data to create Book objects.
 */
function combineBooksWithGoodreadsData(
  allMlpBooks: MlpBookData[],
  goodreadsDataList: GoodreadsData[],
  existingBooks: Book[],
  options: ScrapingOptions,
): Book[] {
  const newCombinedBooks: Book[] = [];
  const currentTimestamp = new Date().toISOString();
  const existingBooksMap = new Map(
    existingBooks.map((book) => [book.detailUrl, book]),
  );

  // Determine which books were processed for Goodreads
  const booksForGoodreads = getBooksForGoodreads(
    allMlpBooks,
    existingBooks,
    options,
  );
  const processedForGoodreadsMap = new Map(
    booksForGoodreads.map((book, index) => [book.detailUrl, index]),
  );

  // Process all MLP books
  for (const mlpBook of allMlpBooks) {
    const goodreadsIndex = processedForGoodreadsMap.get(mlpBook.detailUrl);

    if (goodreadsIndex !== undefined && goodreadsDataList[goodreadsIndex]) {
      // Book was processed for Goodreads - use new data
      const goodreadsData = goodreadsDataList[goodreadsIndex];
      newCombinedBooks.push({
        ...mlpBook,
        ...goodreadsData,
        mlpScrapedAt: currentTimestamp,
        goodreadsScrapedAt: currentTimestamp,
      });
    } else {
      // Book was not processed for Goodreads - preserve existing or use defaults
      const existingBook = existingBooksMap.get(mlpBook.detailUrl);

      if (existingBook && !options.mlpOnly) {
        // Update MLP data while preserving existing Goodreads data
        newCombinedBooks.push({
          ...mlpBook,
          rating: existingBook.rating,
          ratingsCount: existingBook.ratingsCount,
          url: existingBook.url,
          genres: existingBook.genres,
          mlpScrapedAt: currentTimestamp,
          goodreadsScrapedAt: existingBook.goodreadsScrapedAt,
        });
      } else {
        // For books not yet processed for Goodreads, add them with empty Goodreads data
        newCombinedBooks.push({
          ...mlpBook,
          rating: null,
          ratingsCount: null,
          url: null,
          genres: [],
          mlpScrapedAt: currentTimestamp,
          goodreadsScrapedAt: null,
        });
      }
    }
  }

  return newCombinedBooks;
}

/**
 * Main scraping function.
 */
async function main() {
  // Parse command line arguments
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

  console.log("🚀 Starting the v2 scraping process...");

  if (argv.forceMlp) {
    console.log(
      "🔄 Force MLP mode: Will re-scrape all MLP books regardless of existing data",
    );
  }
  if (argv.forceGoodreads) {
    console.log(
      "🔄 Force Goodreads mode: Will re-scrape all Goodreads data regardless of existing ratings",
    );
  }
  if (argv.mlpOnly) {
    console.log("📚 MLP only mode: Skipping Goodreads scraping");
  }
  if (argv.goodreadsOnly) {
    console.log("⭐ Goodreads only mode: Skipping MLP scraping");
  }

  // 1. Load existing books
  const existingBooks = await loadExistingBooks();

  let allMlpBooks: MlpBookData[] = [];

  // 2. Scrape all books from MLP (unless in goodreads-only mode)
  if (!argv.goodreadsOnly) {
    // Scrape basic info for all books from the listing pages
    const basicMlpBooks: MlpBookListing[] = await scrapeMlpListingPages();

    // Determine which books need their details scraped
    const existingBooksMap = new Map(
      existingBooks.map((book) => [book.detailUrl, book]),
    );
    const booksNeedingDetails = argv.forceMlp
      ? basicMlpBooks // Force mode: scrape details for all books
      : basicMlpBooks.filter((book) => {
          const existingBook = existingBooksMap.get(book.detailUrl);
          // Scrape if the book is new, or if it's missing download links
          return !existingBook || !existingBook.pdfUrl || !existingBook.epubUrl;
        });

    console.log(
      `${booksNeedingDetails.length} new MLP books need detail scraping.`,
    );

    // Scrape details for new books
    let newlyScrapedBooks: MlpBookData[] = [];
    if (booksNeedingDetails.length > 0) {
      newlyScrapedBooks = await processBatch({
        items: booksNeedingDetails,
        concurrency: CONCURRENCY,
        onProgress: (progress, total, item) => {
          console.log(
            `[${progress}/${total}] Fetching MLP details: ${item.title}`,
          );
        },
        processItem: async (basicBook) => {
          try {
            const details = await withRetry(
              () => scrapeMlpBookDetails(basicBook.detailUrl),
              {
                retries: RETRY_COUNT,
                delay: RETRY_DELAY,
                factor: RETRY_FACTOR,
                maxDelay: RETRY_MAX_DELAY,
                onRetry: (error, attempt) => {
                  console.warn(
                    `[RETRY ${attempt}/${RETRY_COUNT}] Failed fetching MLP details for "${basicBook.title}": ${error.message}`,
                  );
                },
              },
            );
            return { ...basicBook, ...details } as MlpBookData;
          } catch (error) {
            console.error(
              `[ERROR] Failed to fetch MLP details for "${basicBook.title}" after all retries. Skipping.`,
            );
            return {
              ...basicBook,
              partTitle: null,
              imageUrl: null,
              description: null,
              pdfUrl: null,
              epubUrl: null,
            } as MlpBookData;
          }
        },
      });
    }

    // Combine newly scraped books with existing books that were not re-scraped

    const unchangedBooks = argv.forceMlp
      ? []
      : existingBooks
          .filter((existingBook) =>
            basicMlpBooks.some(
              (basicBook) => basicBook.detailUrl === existingBook.detailUrl,
            ),
          )
          .map(
            (book): MlpBookData => ({
              title: book.title,
              partTitle: book.partTitle,
              author: book.author,
              publisher: book.publisher,
              year: book.year,
              imageUrl: book.imageUrl,
              detailUrl: book.detailUrl,
              pdfUrl: book.pdfUrl,
              epubUrl: book.epubUrl,
              description: book.description,
            }),
          );

    allMlpBooks = [...newlyScrapedBooks, ...unchangedBooks];
    console.log(`✅ Found ${allMlpBooks.length} total books from MLP.`);
  } else {
    // In goodreads-only mode, use existing books as MLP books
    allMlpBooks = existingBooks.map(
      (book): MlpBookData => ({
        title: book.title,
        partTitle: book.partTitle,
        author: book.author,
        publisher: book.publisher,
        year: book.year,
        imageUrl: book.imageUrl,
        detailUrl: book.detailUrl,
        pdfUrl: book.pdfUrl,
        epubUrl: book.epubUrl,
        description: book.description,
      }),
    );

    console.log(
      `📚 Using ${allMlpBooks.length} existing books for Goodreads processing.`,
    );
  }

  // 3. Determine which books need Goodreads processing
  const booksForGoodreads = getBooksForGoodreads(
    allMlpBooks,
    existingBooks,
    argv,
  );

  console.log(
    `📋 ${booksForGoodreads.length} books need Goodreads processing, ${allMlpBooks.length - booksForGoodreads.length} already complete.`,
  );

  // 4. Scrape Goodreads for books that need it
  let goodreadsDataList: GoodreadsData[] = [];

  if (booksForGoodreads.length > 0 && !argv.mlpOnly) {
    console.log(
      `🔍 Starting Goodreads scraping for ${booksForGoodreads.length} books...`,
    );
    goodreadsDataList = await processBatch({
      items: booksForGoodreads,
      concurrency: CONCURRENCY,
      onProgress: (progress, total, item) => {
        console.log(`[${progress}/${total}] Processing: ${item.title}`);
      },
      processItem: (book) =>
        withRetry(() => scrapeGoodreads(book), {
          retries: RETRY_COUNT,
          delay: RETRY_DELAY,
          factor: RETRY_FACTOR,
          maxDelay: RETRY_MAX_DELAY,
          onRetry: (error, attempt) => {
            console.warn(
              `[RETRY ${attempt}/${RETRY_COUNT}] Failed fetching Goodreads data for "${book.title}": ${error.message}`,
            );
          },
        }),
    });
  } else {
    // Fill with empty data for books that weren't processed
    goodreadsDataList = booksForGoodreads.map(() => ({
      rating: null,
      ratingsCount: null,
      url: null,
      genres: [],
    }));
  }

  // 5. Combine books with Goodreads data
  const newBooks = combineBooksWithGoodreadsData(
    allMlpBooks,
    goodreadsDataList,
    existingBooks,
    argv,
  );

  // 6. Merge with existing books
  const allCombinedBooks = mergeBooks(existingBooks, newBooks, {
    forceMlp: argv.forceMlp,
    goodreadsOnly: argv.goodreadsOnly,
  });

  console.log(
    `📚 Total books: ${allCombinedBooks.length} (${existingBooks.length} existing + ${newBooks.length} new/updated)`,
  );

  // 7. Save the results to a JSON file
  await saveBooks(allCombinedBooks);

  // 8. Save the timestamp of successful completion
  await saveScrapingTimestamp();

  console.log("🎉 Scraping complete!");
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
