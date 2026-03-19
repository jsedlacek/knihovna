import { createLogger } from "#@/lib/server/utils/logger.ts";
import type { Book, MlpBookDetails, MlpBookListing } from "#@/lib/shared/types/book-types.ts";

const log = createLogger("book-fixup");

/**
 * Fields that can be fixed via the fixup system.
 * Only includes MLP data since fixups are applied after MLP scraping but before Goodreads.
 */
type FixableBookFields = MlpBookListing & MlpBookDetails;

/**
 * Configuration for fixing specific book data issues.
 * Each fixup is identified by the book's titulKey and contains the corrections to apply.
 *
 * Derived from the Book interface to ensure all fixable fields are available
 * and automatically stay in sync with schema changes.
 */
interface BookFixup extends Partial<FixableBookFields> {
  /** The MLP titul key to match against */
  titulKey: number;
  /** Reason for the fixup (for documentation) */
  reason: string;
}

/**
 * Known book data corrections.
 * Add new entries here when scraped data needs manual correction.
 */
const BOOK_FIXUPS: BookFixup[] = [
  {
    titulKey: 4359869,
    title: "České snění",
    reason: "Original title is incorrect on MLP - should be 'České snění' not 'České okamžiky'",
  },
];

/**
 * Applies configured fixups to a book if a matching fixup exists.
 *
 * @param book - The book to potentially fix
 * @returns The book with fixups applied, or the original book if no fixups match
 */
export function applyBookFixups(book: Book): Book {
  const fixup = BOOK_FIXUPS.find((f) => f.titulKey === book.titulKey);

  if (!fixup) {
    return book;
  }

  log.info("Applying fixup", { title: book.title, reason: fixup.reason });

  // Create a new book object with fixups applied
  const fixedBook: Book = { ...book };

  if (fixup.title !== undefined) {
    log.info("Fixup applied", { field: "title", from: book.title, to: fixup.title });
    fixedBook.title = fixup.title;
  }

  if (fixup.author !== undefined) {
    log.info("Fixup applied", { field: "author", from: book.author, to: fixup.author });
    fixedBook.author = fixup.author;
  }

  if (fixup.subtitle !== undefined) {
    log.info("Fixup applied", { field: "subtitle", from: book.subtitle, to: fixup.subtitle });
    fixedBook.subtitle = fixup.subtitle;
  }

  if (fixup.description !== undefined) {
    log.info("Fixup applied", { field: "description" });
    fixedBook.description = fixup.description;
  }

  if (fixup.publisher !== undefined) {
    log.info("Fixup applied", { field: "publisher", from: book.publisher, to: fixup.publisher });
    fixedBook.publisher = fixup.publisher;
  }

  if (fixup.year !== undefined) {
    log.info("Fixup applied", { field: "year", from: book.year, to: fixup.year });
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
    log.info("Book fixups applied", { count: fixupsApplied });
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
 * @param titulKey - The titul key to check
 * @returns True if a fixup exists for this book
 */
export function hasFixup(titulKey: number): boolean {
  return BOOK_FIXUPS.some((fixup) => fixup.titulKey === titulKey);
}
