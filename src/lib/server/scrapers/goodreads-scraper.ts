import * as cheerio from "cheerio";
import { createUrl, fetchHtml } from "#@/lib/server/utils/fetch-utils.ts";
import {
  GOODREADS_BASE_URL,
  MAX_RATING,
  MIN_RATING,
} from "#@/lib/shared/config/scraper-config.ts";
import type { GoodreadsData } from "#@/lib/shared/types/book-types.ts";
import {
  calculateSimilarity,
  cleanSearchTerm,
  formatNumberCzech,
  getAuthorForSearch,
  getTitleWithArabicNumerals,
} from "#@/lib/shared/utils/text-utils.ts";

/**
 * Represents a book candidate found in Goodreads search results,
 * including its relevance score.
 */
interface BookCandidate {
  url: string;
  title: string;
  author: string;
  ratingsCount: number;
  score: number;
}

/**
 * Extract rating and ratings count from JSON-LD structured data.
 */
function extractFromJsonLd($: cheerio.CheerioAPI): {
  rating: number | null;
  ratingsCount: number | null;
} {
  const jsonLdScript = $('script[type="application/ld+json"]').html();
  if (!jsonLdScript) return { rating: null, ratingsCount: null };

  try {
    const data = JSON.parse(jsonLdScript);
    let rating: number | null = null;
    let ratingsCount: number | null = null;

    if (data.aggregateRating?.ratingValue) {
      rating = parseFloat(data.aggregateRating.ratingValue);
    }
    if (data.aggregateRating?.ratingCount) {
      ratingsCount = parseInt(
        data.aggregateRating.ratingCount.toString().replace(/,/g, ""),
        10,
      );
    }

    return { rating, ratingsCount };
  } catch {
    return { rating: null, ratingsCount: null };
  }
}

/**
 * Extract rating and ratings count from HTML elements.
 */
function extractFromHtml($: cheerio.CheerioAPI): {
  rating: number | null;
  ratingsCount: number | null;
} {
  let rating: number | null = null;
  let ratingsCount: number | null = null;

  // Try to extract rating
  const ratingText = $(".RatingStatistics__rating").first().text().trim();
  if (ratingText) {
    rating = parseFloat(ratingText);
  }

  // Try to extract ratings count
  const ratingsCountText = $(".RatingStatistics__meta").first().text();
  const countMatch = ratingsCountText.match(
    /(\d{1,3}(?:,\d{3})*|\d+)\sratings/,
  );
  if (countMatch?.[1]) {
    ratingsCount = parseInt(countMatch[1].replace(/,/g, ""), 10);
  }

  return { rating, ratingsCount };
}

/**
 * Extract genres from various Goodreads page structures.
 */

/**
 * Validate rating data.
 */
export function validateRating(
  rating: number | null,
  ratingsCount: number | null,
): {
  isValid: boolean;
  validatedRating: number | null;
  validatedCount: number | null;
} {
  if (
    rating !== null &&
    !Number.isNaN(rating) &&
    rating >= MIN_RATING &&
    rating <= MAX_RATING
  ) {
    const validatedCount =
      ratingsCount !== null && !Number.isNaN(ratingsCount) ? ratingsCount : 0;
    if (validatedCount > 0) {
      return {
        isValid: true,
        validatedRating: rating,
        validatedCount,
      };
    }
  }

  return {
    isValid: false,
    validatedRating: null,
    validatedCount:
      ratingsCount !== null && !Number.isNaN(ratingsCount)
        ? ratingsCount
        : null,
  };
}

/**
 * Extract book candidates from Goodreads search results HTML.
 */
export function extractBookCandidates($: cheerio.CheerioAPI): BookCandidate[] {
  const candidates: BookCandidate[] = [];

  $("a.bookTitle[href*='/book/show/']").each((_, element) => {
    const titleEl = $(element);
    const candidateUrl = titleEl.attr("href") || "";
    const candidateTitle = titleEl.text().trim();

    if (!candidateUrl || !candidateTitle) return;

    // Find the author for this book result
    const bookRow = titleEl.closest("tr");
    const authorEl = bookRow.find("a.authorName").first();
    const candidateAuthor = authorEl.text().trim();

    // Extract ratings count
    const ratingsText = bookRow.find(".minirating").text();
    const ratingsMatch = ratingsText.match(/([\d,]+)\s+ratings/);
    const ratingsCount = ratingsMatch?.[1]
      ? parseInt(ratingsMatch[1].replace(/,/g, ""), 10)
      : 0;

    candidates.push({
      url: candidateUrl,
      title: candidateTitle,
      author: candidateAuthor,
      ratingsCount,
      score: 0, // Will be calculated separately
    });
  });

  return candidates;
}

/**
 * Calculate relevance score for a book candidate.
 */
export function scoreBookCandidate(
  candidate: BookCandidate,
  searchBook: { title: string; author: string },
): number {
  const authorSurname = getAuthorForSearch(searchBook.author);
  let score = 0;

  const lowerAuthor = candidate.author.toLowerCase();
  const lowerTitle = candidate.title.toLowerCase();
  const lowerSearchTitle = searchBook.title.toLowerCase();

  // Author Score (High Priority)
  if (lowerAuthor.includes(authorSurname.toLowerCase())) {
    score += 50;
  }
  if (lowerAuthor.includes("source wikipedia")) {
    score -= 100;
  }

  // Title Score (Medium Priority)
  const titleSimilarity = calculateSimilarity(lowerSearchTitle, lowerTitle);
  score += titleSimilarity * 20;

  // Exact title match bonus
  if (lowerTitle === lowerSearchTitle) {
    score += 25;
  }

  // Length penalty for overly long titles (compilation books)
  const titleLengthDiff = Math.abs(
    candidate.title.length - searchBook.title.length,
  );
  if (titleLengthDiff > 10) {
    score -= titleLengthDiff * 0.3;
  }

  // Popularity tie-breaker (Low Priority)
  if (candidate.ratingsCount > 0) {
    score += Math.log10(candidate.ratingsCount) * 2;
  }

  return score;
}

/**
 * Select the best book candidate from a list based on scores.
 */
export function selectBestBookCandidate(
  candidates: BookCandidate[],
  searchBook: { title: string; author: string },
): string | null {
  if (candidates.length === 0) return null;

  // Score each candidate
  const scoredCandidates = candidates.map((candidate) => ({
    ...candidate,
    score: scoreBookCandidate(candidate, searchBook),
  }));

  // Sort by score (highest first) and select the best match
  scoredCandidates.sort((a, b) => b.score - a.score);

  return scoredCandidates[0]?.url || null;
}

/**
 * Find the best matching book link from Goodreads search results HTML using scoring.
 */
export function findBookLinkFromSearch(
  searchHtml: string,
  book: { title: string; author: string },
): string | null {
  try {
    const $ = cheerio.load(searchHtml);
    const candidates = extractBookCandidates($);

    return selectBestBookCandidate(candidates, book);
  } catch (error) {
    console.error("Error parsing search results with scoring:", error);
    return null;
  }
}

/**
 * Parse Goodreads book data from book detail page HTML.
 */
export function parseGoodreadsBookData(bookHtml: string): {
  rating: number | null;
  ratingsCount: number | null;
} {
  try {
    const $book = cheerio.load(bookHtml);

    // Extract rating and ratings count
    let { rating, ratingsCount } = extractFromJsonLd($book);

    // Fallback to HTML elements if JSON-LD didn't work
    if (rating === null || ratingsCount === null) {
      const htmlData = extractFromHtml($book);
      rating = rating ?? htmlData.rating;
      ratingsCount = ratingsCount ?? htmlData.ratingsCount;
    }

    return { rating, ratingsCount };
  } catch (error) {
    console.error("Error parsing book data:", error);
    return { rating: null, ratingsCount: null };
  }
}

/**
 * Scrape Goodreads data for a single book.
 */
export async function scrapeGoodreads(book: {
  title: string;
  author: string;
}): Promise<GoodreadsData> {
  const authorForSearch = getAuthorForSearch(book.author);

  try {
    // --- Helper function to perform a search query ---
    const performSearch = async (title: string): Promise<string | null> => {
      const cleanedTitle = cleanSearchTerm(title);
      const searchQuery = encodeURIComponent(
        `${cleanedTitle} ${authorForSearch}`,
      );
      const searchUrl = `${GOODREADS_BASE_URL}/search?q=${searchQuery}&search_type=books`;
      console.log(
        `Searching Goodreads for: "${cleanedTitle}" by ${authorForSearch}`,
      );
      const searchHtml = await fetchHtml(searchUrl);
      return findBookLinkFromSearch(searchHtml, { title, author: book.author });
    };

    // 1. Primary search attempt
    let bookUrlPath = await performSearch(book.title);

    // 2. Fallback search attempt if the primary one fails
    if (!bookUrlPath) {
      const fallbackTitle = getTitleWithArabicNumerals(book.title);
      // Only attempt fallback if the title was actually changed
      if (fallbackTitle !== book.title) {
        console.log(`-> Primary search failed. Trying fallback title...`);
        bookUrlPath = await performSearch(fallbackTitle);
      }
    }

    if (!bookUrlPath) {
      console.warn(
        `! No book link found for: ${book.title} (after all attempts)`,
      );
      return {
        rating: null,
        ratingsCount: null,
        url: null,
      };
    }

    const bookUrl = createUrl(GOODREADS_BASE_URL, bookUrlPath);
    const bookHtml = await fetchHtml(bookUrl);
    const { rating, ratingsCount } = parseGoodreadsBookData(bookHtml);

    // Validate the rating data
    const { isValid, validatedRating, validatedCount } = validateRating(
      rating,
      ratingsCount,
    );

    if (isValid) {
      console.log(
        `⭐ Found rating: ${validatedRating} (${validatedCount ? formatNumberCzech(validatedCount) : "0"} ratings)`,
      );
      return {
        rating: validatedRating,
        ratingsCount: validatedCount,
        url: bookUrl,
      };
    }

    // Found a book page but no valid ratings
    console.warn(`! Could not parse valid rating for: ${book.title}`);
    return {
      rating: null,
      ratingsCount: validatedCount,
      url: bookUrl,
    };
  } catch (error) {
    console.error(
      `❌ Error scraping Goodreads for "${book.title}"`,
      error instanceof Error ? error.message : error,
    );
    return {
      rating: null,
      ratingsCount: null,
      url: null,
    };
  }
}
