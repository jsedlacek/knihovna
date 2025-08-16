import type { Book } from "#@/lib/shared/types/book-types.ts";
import { cleanTextForSearch } from "#@/lib/shared/utils/text-utils.ts";

/**
 * Constructs a Goodreads search URL from a book's title and author.
 *
 * This utility cleans the title and author names to create a more effective
 * search query, improving the chances of finding the correct book on Goodreads.
 *
 * @param book - A book object containing at least a title and author.
 * @returns A fully formed URL for searching on Goodreads.
 */
export function createGoodreadsSearchUrl(
  book: Pick<Book, "title" | "author">,
): string {
  // Use a centralized utility to clean the text for a search query
  const cleanedTitle = cleanTextForSearch(book.title);

  // Use only the primary author name (before any comma) for a cleaner search
  const primaryAuthor = book.author.split(",")[0]?.trim() || book.author;
  const cleanedAuthor = cleanTextForSearch(primaryAuthor);

  const searchQuery = encodeURIComponent(`${cleanedTitle} ${cleanedAuthor}`);

  return `https://www.goodreads.com/search?q=${searchQuery}&search_type=books`;
}
