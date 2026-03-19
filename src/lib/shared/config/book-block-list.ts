/**
 * Simple block-list of book titul keys that should be excluded from the site.
 *
 * Add MLP titul keys here for books that are:
 * - Incorrectly matched with wrong Goodreads data
 * - Children's books that got adult book ratings
 * - Duplicate entries
 * - Any other problematic books
 */

const BLOCKED_BOOK_KEYS: number[] = [
  // Children's fairy tale book incorrectly matched with adult book data
  4687052,
];

/**
 * Check if a book should be blocked based on its titul key.
 */
export function isBookBlocked(titulKey: number): boolean {
  return BLOCKED_BOOK_KEYS.includes(titulKey);
}

/**
 * Filter out blocked books from a list of books.
 */
export function filterBlockedBooks<T extends { titulKey: number }>(books: T[]): T[] {
  return books.filter((book) => !isBookBlocked(book.titulKey));
}
