import type { Book } from "#@/lib/shared/types/book-types.ts";
import { romanToArabic } from "#@/lib/shared/utils/text-utils.ts";

/**
 * Normalizes Roman numerals to Arabic numerals for deduplication.
 * Handles both parentheses format "(II)" and standalone format "II".
 */
function normalizeRomanNumeralsForDeduplication(text: string): string {
  // Replace Roman numerals in parentheses: "(II)" -> " 2"
  let result = text.replace(/\s*\(([IVXLCDM]+)\)/gi, (match, romanNumeral) => {
    const arabic = romanToArabic(romanNumeral);
    return arabic > 0 ? ` ${arabic}` : match;
  });

  // Replace standalone Roman numerals: "Part II" -> "Part 2"
  result = result.replace(/\b([IVXLCDM]+)\b/gi, (match) => {
    const arabic = romanToArabic(match);
    return arabic > 0 ? arabic.toString() : match;
  });

  return result;
}

/**
 * Normalizes text for deduplication by removing punctuation, extra whitespace, converting to lowercase,
 * normalizing Roman numerals to Arabic numerals, and removing diacritics.
 */
function normalizeForDeduplication(text: string | null): string {
  if (!text) return "";

  return normalizeRomanNumeralsForDeduplication(text)
    .toLowerCase()
    .normalize("NFD") // Decompose diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[,;:.!?()[\]{}""''„"‚']/g, "") // Remove common punctuation
    .replace(/\b([a-z])\s+([a-z])\s+([a-z])\b/g, "$1$2$3") // Normalize spaced initials like "j r r" to "jrr"
    .replace(/\b([a-z])\s+([a-z])\b/g, "$1$2") // Normalize spaced initials like "j r" to "jr"
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Removes duplicate books, keeping only the newer version.
 * When books have the same year, logs a conflict message and keeps all.
 */
export function deduplicateBooks(books: Book[]): Book[] {
  const bookGroups = new Map<string, Book[]>();

  // Group books by normalized author + title + subtitle + partTitle
  for (const book of books) {
    const normalizedAuthor = normalizeForDeduplication(book.author);
    const normalizedTitle = normalizeForDeduplication(book.title);
    const normalizedSubtitle = normalizeForDeduplication(book.subtitle || "");
    const normalizedPartTitle = normalizeForDeduplication(book.partTitle || "");

    const key = `${normalizedAuthor}-${normalizedTitle}-${normalizedSubtitle}-${normalizedPartTitle}`;
    if (!bookGroups.has(key)) {
      bookGroups.set(key, []);
    }
    bookGroups.get(key)?.push(book);
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
