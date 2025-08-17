import type { Book } from "#@/lib/shared/types/book-types.ts";

/**
 * Removes duplicate books, keeping only the newer version.
 * When books have the same year, logs a conflict message and keeps all.
 */
export function deduplicateBooks(books: Book[]): Book[] {
  const bookGroups = new Map<string, Book[]>();

  // Group books by author + title + partTitle
  for (const book of books) {
    const key = `${book.author}-${book.title}-${book.partTitle || ""}`;
    if (!bookGroups.has(key)) {
      bookGroups.set(key, []);
    }
    bookGroups.get(key)!.push(book);
  }

  const result: Book[] = [];

  // Process each group
  for (const [key, groupBooks] of bookGroups) {
    if (groupBooks.length === 1) {
      result.push(groupBooks[0]);
    } else {
      // Multiple books with same author/title/partTitle
      const booksWithYear = groupBooks.filter((book) => book.year);
      const booksWithoutYear = groupBooks.filter((book) => !book.year);

      if (booksWithYear.length === 0) {
        // No years available, keep all
        result.push(...groupBooks);
      } else if (booksWithYear.length === 1) {
        // Only one has a year, keep it and any without years
        result.push(booksWithYear[0], ...booksWithoutYear);
      } else {
        // Multiple books with years
        const maxYear = Math.max(...booksWithYear.map((book) => book.year!));
        const newestBooks = booksWithYear.filter(
          (book) => book.year === maxYear,
        );

        if (newestBooks.length > 1) {
          // Multiple books with same newest year - conflict
          console.log(
            `Duplicate books conflict: "${groupBooks[0].author} - ${groupBooks[0].title}${groupBooks[0].partTitle ? ` (${groupBooks[0].partTitle})` : ""}" - multiple books from year ${maxYear}`,
          );
          result.push(...newestBooks, ...booksWithoutYear);
        } else {
          // Single newest book
          result.push(newestBooks[0], ...booksWithoutYear);
        }
      }
    }
  }

  return result;
}
