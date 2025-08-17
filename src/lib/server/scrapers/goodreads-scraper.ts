import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import type { GoodreadsData } from "#@/lib/shared/types/book-types.ts";
import { fetchHtml, createUrl } from "#@/lib/server/utils/fetch-utils.ts";
import {
  cleanSearchTerm,
  getAuthorForSearch,
  getTitleWithArabicNumerals,
} from "#@/lib/shared/utils/text-utils.ts";
import {
  GOODREADS_BASE_URL,
  MAX_GENRES,
  NON_GENRE_TERMS,
  KNOWN_GENRES,
  MIN_RATING,
  MAX_RATING,
} from "#@/lib/shared/config/scraper-config.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

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
  if (countMatch && countMatch[1]) {
    ratingsCount = parseInt(countMatch[1].replace(/,/g, ""));
  }

  return { rating, ratingsCount };
}

/**
 * Extract genres from various Goodreads page structures.
 */
export function extractGenres($: cheerio.CheerioAPI): string[] {
  let genres: string[] = [];

  try {
    // Try multiple selectors for genres/shelves
    const genreSelectors = [
      ".BookPageMetadataSection__genres .Button--tag",
      ".BookPageMetadataSection__genres .Button--tag-inline",
      ".genres .actionLinkLite.bookPageGenreLink",
      ".elementList .actionLinkLite.bookPageGenreLink",
      '[data-testid="genresList"] .Button--tag-inline',
      ".BookPageMetadataSection .Button--tag-inline",
    ];

    for (const selector of genreSelectors) {
      const genreElements = $(selector);
      if (genreElements.length > 0) {
        genreElements.each((_: number, element: AnyNode) => {
          const genreText = $(element).text().trim();
          if (genreText && !genres.includes(genreText)) {
            genres.push(genreText);
          }
        });
        break; // Found genres with this selector, stop trying others
      }
    }

    // New Goodreads structure: extract from CollapsableList text
    if (genres.length === 0) {
      const genreContainer = $(".BookPageMetadataSection__genres");
      if (genreContainer.length > 0) {
        const fullText = genreContainer.text().trim();
        // Text format: "GenresFantasyFictionYoung AdultMagicChildrens...more..."
        if (fullText.startsWith("Genres")) {
          const genreText = fullText
            .substring(6)
            .replace("...more...", "")
            .trim();

          // Find genres that appear in the text
          for (const genre of KNOWN_GENRES) {
            if (genreText.includes(genre) && !genres.includes(genre)) {
              genres.push(genre);
            }
          }
        }
      }
    }

    // If no genres found with buttons, try shelf tags
    if (genres.length === 0) {
      $(".shelfStat .shelfName").each((_: number, element: AnyNode) => {
        const shelfName = $(element).text().trim();
        if (shelfName && !genres.includes(shelfName)) {
          genres.push(shelfName);
        }
      });
    }

    // Limit to first 10 genres and filter out common non-genre terms
    genres = genres
      .filter((genre) => !NON_GENRE_TERMS.includes(genre.toLowerCase()))
      .slice(0, MAX_GENRES);
  } catch (genreError) {
    console.warn(`Could not extract genres:`, genreError);
  }

  return genres;
}

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
 * Find book link from Goodreads search results HTML.
 */
export function findBookLinkFromSearch(searchHtml: string): string | null {
  try {
    const $search = cheerio.load(searchHtml);
    const bookLink = $search("a.bookTitle[href*='/book/show/']").first();
    return bookLink.attr("href") || null;
  } catch (error) {
    console.error("Error parsing search results:", error);
    return null;
  }
}

/**
 * Parse Goodreads book data from book detail page HTML.
 */
export function parseGoodreadsBookData(bookHtml: string): {
  rating: number | null;
  ratingsCount: number | null;
  genres: string[];
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

    // Extract genres
    const genres = extractGenres($book);

    return { rating, ratingsCount, genres };
  } catch (error) {
    console.error("Error parsing book data:", error);
    return { rating: null, ratingsCount: null, genres: [] };
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
      return findBookLinkFromSearch(searchHtml);
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
        genres: [],
      };
    }

    const bookUrl = createUrl(GOODREADS_BASE_URL, bookUrlPath);
    const bookHtml = await fetchHtml(bookUrl);
    const { rating, ratingsCount, genres } = parseGoodreadsBookData(bookHtml);

    // Validate the rating data
    const { isValid, validatedRating, validatedCount } = validateRating(
      rating,
      ratingsCount,
    );

    if (isValid) {
      const genresInfo =
        genres.length > 0 ? ` | Genres: ${genres.join(", ")}` : "";
      console.log(
        `⭐ Found rating: ${validatedRating} (${validatedCount ? formatNumberCzech(validatedCount) : "0"} ratings)${genresInfo}`,
      );
      return {
        rating: validatedRating,
        ratingsCount: validatedCount,
        url: bookUrl,
        genres,
      };
    }

    // Found a book page but no valid ratings
    const genresInfo =
      genres.length > 0 ? ` | Genres: ${genres.join(", ")}` : "";
    console.warn(
      `! Could not parse valid rating for: ${book.title}${genresInfo}`,
    );
    return {
      rating: null,
      ratingsCount: validatedCount,
      url: bookUrl,
      genres,
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
      genres: [],
    };
  }
}
