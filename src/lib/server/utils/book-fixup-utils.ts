import type {
  Book,
  MlpBookDetails,
  MlpBookListing,
} from "#@/lib/shared/types/book-types.ts";

/**
 * Fields that can be fixed via the fixup system.
 * Only includes MLP data since fixups are applied after MLP scraping but before Goodreads.
 */
type FixableBookFields = MlpBookListing & MlpBookDetails;

/**
 * Configuration for fixing specific book data issues.
 * Each fixup is identified by the book's detail URL and contains the corrections to apply.
 *
 * Derived from the Book interface to ensure all fixable fields are available
 * and automatically stay in sync with schema changes.
 */
interface BookFixup extends Partial<FixableBookFields> {
  /** The MLP detail URL to match against */
  detailUrl: string;
  /** Reason for the fixup (for documentation) */
  reason: string;
}

/**
 * Known book data corrections.
 * Add new entries here when scraped data needs manual correction.
 */
const BOOK_FIXUPS: BookFixup[] = [
  {
    detailUrl: "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
    title: "České snění",
    reason:
      "Original title is incorrect on MLP - should be 'České snění' not 'České okamžiky'",
  },
  // Add more fixups here as needed
  // Example:
  // {
  //   detailUrl: "https://search.mlp.cz/cz/titul/some-book/123456/",
  //   author: "Corrected Author Name",
  //   genres: ["Fiction", "Classic"],
  //   reason: "Author name was misspelled and genres were missing",
  // },
];

/**
 * Applies configured fixups to a book if a matching fixup exists.
 *
 * @param book - The book to potentially fix
 * @returns The book with fixups applied, or the original book if no fixups match
 */
export function applyBookFixups(book: Book): Book {
  const fixup = BOOK_FIXUPS.find((f) => f.detailUrl === book.detailUrl);

  if (!fixup) {
    return book;
  }

  console.log(`📝 Applying fixup to "${book.title}": ${fixup.reason}`);

  // Create a new book object with fixups applied
  const fixedBook: Book = { ...book };

  if (fixup.title !== undefined) {
    console.log(`  • Title: "${book.title}" → "${fixup.title}"`);
    fixedBook.title = fixup.title;
  }

  if (fixup.author !== undefined) {
    console.log(`  • Author: "${book.author}" → "${fixup.author}"`);
    fixedBook.author = fixup.author;
  }

  if (fixup.subtitle !== undefined) {
    console.log(`  • Subtitle: "${book.subtitle}" → "${fixup.subtitle}"`);
    fixedBook.subtitle = fixup.subtitle;
  }

  if (fixup.description !== undefined) {
    console.log(`  • Description updated`);
    fixedBook.description = fixup.description;
  }

  if (fixup.publisher !== undefined) {
    console.log(`  • Publisher: "${book.publisher}" → "${fixup.publisher}"`);
    fixedBook.publisher = fixup.publisher;
  }

  if (fixup.year !== undefined) {
    console.log(`  • Year: ${book.year} → ${fixup.year}`);
    fixedBook.year = fixup.year;
  }

  return fixedBook;
}

/**
 * Applies fixups to an array of books.
 *
 * @param books - Array of books to process
 * @returns Array of books with fixups applied
 */
export function applyBookFixupsToArray(books: Book[]): Book[] {
  let fixupsApplied = 0;

  const fixedBooks = books.map((book) => {
    const fixedBook = applyBookFixups(book);
    if (fixedBook !== book) {
      fixupsApplied++;
    }
    return fixedBook;
  });

  if (fixupsApplied > 0) {
    console.log(`✅ Applied ${fixupsApplied} book fixup(s).`);
  }

  return fixedBooks;
}

/**
 * Gets information about configured fixups for debugging/reporting.
 *
 * @returns Array of fixup configurations
 */
export function getConfiguredFixups(): readonly BookFixup[] {
  return BOOK_FIXUPS;
}

/**
 * Checks if a book has a configured fixup.
 *
 * @param detailUrl - The detail URL to check
 * @returns True if a fixup exists for this book
 */
export function hasFixup(detailUrl: string): boolean {
  return BOOK_FIXUPS.some((fixup) => fixup.detailUrl === detailUrl);
}
