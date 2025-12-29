/**
 * Simple block-list of book URLs that should be excluded from the site.
 *
 * Add MLP detail URLs here for books that are:
 * - Incorrectly matched with wrong Goodreads data
 * - Children's books that got adult book ratings
 * - Duplicate entries
 * - Any other problematic books
 */

const BLOCKED_BOOK_URLS = [
  // Children's fairy tale book incorrectly matched with adult book data
  "https://search.mlp.cz/cz/titul/zlaty-klic/4687052/",
];

/**
 * Check if a book should be blocked based on its detail URL.
 */
export function isBookBlocked(detailUrl: string): boolean {
  return BLOCKED_BOOK_URLS.includes(detailUrl);
}

/**
 * Filter out blocked books from a list of books.
 */
export function filterBlockedBooks<T extends { detailUrl: string }>(books: T[]): T[] {
  return books.filter((book) => !isBookBlocked(book.detailUrl));
}
