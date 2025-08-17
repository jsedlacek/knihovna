import type { Book } from "#@/lib/shared/types/book-types.ts";

/**
 * Removes duplicate books, keeping only the newer version.
 * When books have the same year, logs a conflict message and keeps all.
 */
export function deduplicateBooks(books: Book[]): Book[] {
  const bookGroups = new Map<string, Book[]>();

  // Group books by author + title + subtitle + partTitle
  for (const book of books) {
    const key = `${book.author}-${book.title}-${book.subtitle || ""}-${book.partTitle || ""}`;
    if (!bookGroups.has(key)) {
      bookGroups.set(key, []);
    }
    bookGroups.get(key)!.push(book);
  }

  const result: Book[] = [];

  // Process each group
  for (const [, groupBooks] of bookGroups) {
    if (groupBooks.length === 1) {
      result.push(groupBooks[0]!);
    } else {
      // Multiple books with same author/title/subtitle/partTitle
      const booksWithYear = groupBooks.filter((book) => book.year);

      if (booksWithYear.length === 0) {
        // No years available for any book in the group, so we keep all.
        // This might indicate a data issue, so a log is useful.
        const firstBook = groupBooks[0]!;
        console.log(
          `Deduplication skipped for "${firstBook.author} - ${firstBook.title}": No year found.`,
        );
        result.push(...groupBooks);
      } else {
        // If at least one book has a year, we only consider those with a year
        // and discard any that don't.
        const maxYear = Math.max(...booksWithYear.map((book) => book.year!));
        const newestBooks = booksWithYear.filter(
          (book) => book.year === maxYear,
        );

        if (newestBooks.length > 1) {
          // This is a conflict: multiple books from the same (newest) year.
          // We'll log it and keep all of them.
          const firstBook = newestBooks[0]!;
          console.log(
            `Conflict: Multiple books for "${firstBook.author} - ${firstBook.title}" from year ${maxYear}. Keeping all.`,
          );
        }

        // Add the single newest book, or multiple in case of a conflict.
        result.push(...newestBooks);
      }
    }
  }

  return result;
}
