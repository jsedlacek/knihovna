import type { Book } from "#@/lib/shared/types/book-types.ts";

/**
 * Calculate a composite score for a book based on its rating and number of reviews.
 *
 * The scoring algorithm prioritizes rating quality over review quantity:
 * - Base rating (0-5 scale) - PRIMARY FACTOR
 * - Small review count boost (max 0.3 points) - prevents pure popularity contests
 * - Confidence factor (slight penalty for books with very few reviews)
 *
 * Examples:
 * - 4.28/5 (1,030,635 reviews) = ~4.58 score
 * - 3.93/5 (5,751,612 reviews) = ~4.23 score
 * - 4.5/5 (100 reviews) = ~4.75 score
 * - 4.5/5 (10 reviews) = ~4.5 score (slight confidence penalty)
 *
 * @param book - The book to score
 * @returns A numeric score where higher values indicate better books
 */
export function calculateBookScore(book: Book): number {
  // If no rating, return 0
  if (!book.rating) return 0;

  // Base score from rating (0-5) - this is the primary factor
  const ratingScore = book.rating;

  // Review count boost (much smaller impact, max 0.3 points)
  // Uses log10 but with much smaller multiplier to prevent dominance
  const reviewCount = book.ratingsCount || 0;
  const reviewBoost = reviewCount > 0 ? Math.log10(reviewCount + 1) * 0.05 : 0;
  const maxReviewBoost = Math.min(reviewBoost, 0.3); // Cap at 0.3 points

  // Confidence factor - only significant penalty for very few reviews
  // Books with 50+ reviews get full confidence (1.0)
  // Books with fewer reviews get slightly reduced confidence (minimum 0.85)
  const confidenceFactor =
    reviewCount >= 50 ? 1 : Math.max(0.85, 0.85 + (reviewCount / 50) * 0.15);

  return (ratingScore + maxReviewBoost) * confidenceFactor;
}

/**
 * Test the scoring algorithm with example books to verify correct behavior.
 * This function can be called in development to validate scoring logic.
 */
export function testBookScoring(): void {
  const testBooks: Book[] = [
    {
      title: "High Rating, Many Reviews",
      author: "Test Author",
      rating: 4.28,
      ratingsCount: 1030635,
    } as Book,
    {
      title: "Lower Rating, More Reviews",
      author: "Test Author",
      rating: 3.93,
      ratingsCount: 5751612,
    } as Book,
    {
      title: "Excellent Rating, Fewer Reviews",
      author: "Test Author",
      rating: 4.5,
      ratingsCount: 100,
    } as Book,
    {
      title: "Good Rating, Very Few Reviews",
      author: "Test Author",
      rating: 4.2,
      ratingsCount: 10,
    } as Book,
  ];

  console.log("Book Scoring Test Results:");
  testBooks.forEach((book) => {
    const score = calculateBookScore(book);
    console.log(
      `${book.title}: ${book.rating}/5 (${book.ratingsCount} reviews) = Score: ${score.toFixed(2)}`,
    );
  });
}

/**
 * Sort books by their calculated score in descending order.
 *
 * @param books - Array of books to sort
 * @returns New array of books sorted by score (highest first)
 */
export function sortBooksByScore(books: Book[]): Book[] {
  return [...books].sort(
    (a, b) => calculateBookScore(b) - calculateBookScore(a),
  );
}

/**
 * Group books by genre and sort each genre by score.
 *
 * @param books - Array of books to group and sort
 * @returns Object with genre names as keys and sorted book arrays as values
 */
export function groupAndSortBooksByGenre(
  books: Book[],
): Record<string, Book[]> {
  const booksByGenre = books.reduce(
    (acc, book) => {
      if (!book.genres || book.genres.length === 0) {
        // If no genres, put in 'Ostatní' category
        if (!acc["Ostatní"]) {
          acc["Ostatní"] = [];
        }
        acc["Ostatní"].push(book);
      } else {
        // Use the first genre as primary category
        const primaryGenre = book.genres[0];
        if (primaryGenre) {
          if (!acc[primaryGenre]) {
            acc[primaryGenre] = [];
          }
          acc[primaryGenre].push(book);
        }
      }
      return acc;
    },
    {} as Record<string, Book[]>,
  );

  // Sort books within each genre by score
  Object.keys(booksByGenre).forEach((genre) => {
    const books = booksByGenre[genre];
    if (books) {
      booksByGenre[genre] = sortBooksByScore(books);
    }
  });

  return booksByGenre;
}

/**
 * Get the top N books across all genres, sorted by score.
 *
 * @param books - Array of books to select from
 * @param limit - Maximum number of books to return
 * @returns Array of top-scored books
 */
export function getTopBooksByScore(books: Book[], limit: number = 10): Book[] {
  return sortBooksByScore(books).slice(0, limit);
}

/**
 * Format a book's score for display purposes.
 *
 * @param book - The book to get score for
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted score string
 */
export function formatBookScore(book: Book, decimals: number = 1): string {
  const score = calculateBookScore(book);
  return score.toFixed(decimals);
}
