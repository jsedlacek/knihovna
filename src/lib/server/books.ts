import booksJson from "../../../data/books.json";
import lastUpdatedJson from "../../../data/last-updated.json";
import { filterBlockedBooks } from "../shared/config/book-block-list";
import { deduplicateBooks } from "../shared/utils/book-deduplication";
import { sortBooksByScore } from "../shared/utils/book-scoring";

const unblockedBooks = filterBlockedBooks(booksJson);

// Remove duplicate books, keeping only the newer version
const deduplicatedBooks = deduplicateBooks(unblockedBooks);

// Then filter books with a rating of 4.0 or higher and have EPUB download links
const filteredBooks = deduplicatedBooks.filter(
  (book) => book.rating !== null && book.rating >= 4.0 && book.epubUrl,
);

// Sort all books by score
export const books = sortBooksByScore(filteredBooks);

export const lastUpdated = lastUpdatedJson;
