import { test, describe } from "node:test";
import assert from "node:assert";
import {
  findBookLinkFromSearch,
  parseGoodreadsBookData,
  extractGenres,
  validateRating,
} from "./goodreads-scraper.ts";
import { loadFixture } from "#@/test/utils/test-utils.ts";
import {
  getTitleWithArabicNumerals,
  cleanSearchTerm,
} from "#@/lib/shared/utils/text-utils.ts";
import * as cheerio from "cheerio";

describe("Goodreads Scraper HTML Parsing", () => {
  describe("findBookLinkFromSearch", () => {
    test("should extract book link from search results", () => {
      const searchHtml = `
        <html>
          <body>
            <div class="tableList">
              <table>
                <tr>
                  <td>
                    <a class="bookTitle" href="/book/show/5907.The_Hobbit">The Hobbit</a>
                  </td>
                </tr>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = findBookLinkFromSearch(searchHtml);

      assert.strictEqual(result, "/book/show/5907.The_Hobbit");
    });

    test("should return null when no book link found", () => {
      const searchHtml = `
        <html>
          <body>
            <div>No results found</div>
          </body>
        </html>
      `;

      const result = findBookLinkFromSearch(searchHtml);

      assert.strictEqual(result, null);
    });

    test("should handle multiple book links and return first", () => {
      const searchHtml = `
        <html>
          <body>
            <a class="bookTitle" href="/book/show/123.First_Book">First Book</a>
            <a class="bookTitle" href="/book/show/456.Second_Book">Second Book</a>
          </body>
        </html>
      `;

      const result = findBookLinkFromSearch(searchHtml);

      assert.strictEqual(result, "/book/show/123.First_Book");
    });

    test("should handle malformed HTML gracefully", () => {
      const malformedHtml = `<html><body><a class="bookTitle" href="/book/show/123">Unclosed`;

      const result = findBookLinkFromSearch(malformedHtml);

      // Should not throw and should return reasonable result
      assert.ok(typeof result === "string" || result === null);
    });

    test("should handle empty HTML", () => {
      const result = findBookLinkFromSearch("");

      assert.strictEqual(result, null);
    });
  });

  describe("parseGoodreadsBookData", () => {
    test("should extract rating and genres from real Goodreads fixture", () => {
      const goodreadsHtml = loadFixture("goodreads-sample.html");

      const result = parseGoodreadsBookData(goodreadsHtml);

      assert.ok(result.rating !== null, "Rating should be extracted");
      assert.ok(
        result.ratingsCount !== null,
        "Ratings count should be extracted",
      );
      assert.ok(Array.isArray(result.genres), "Genres should be an array");
      assert.ok(result.genres.length > 0, "Should extract some genres");

      console.log("Extracted Goodreads data:", result);
    });

    test("should extract data from HTML elements", () => {
      const bookHtml = `
        <html>
          <body>
            <div class="RatingStatistics__rating">4.25</div>
            <div class="RatingStatistics__meta">5,000 ratings</div>
            <div class="BookPageMetadataSection__genres">
              <span class="Button--tag">Fantasy</span>
              <span class="Button--tag">Fiction</span>
              <span class="Button--tag">Adventure</span>
            </div>
          </body>
        </html>
      `;

      const result = parseGoodreadsBookData(bookHtml);

      assert.strictEqual(result.rating, 4.25);
      assert.strictEqual(result.ratingsCount, 5000);
      assert.deepStrictEqual(result.genres, [
        "Fantasy",
        "Fiction",
        "Adventure",
      ]);
    });

    test("should extract data from JSON-LD structured data", () => {
      const bookHtml = `
        <html>
          <head>
            <script type="application/ld+json">
              {
                "aggregateRating": {
                  "ratingValue": "4.29",
                  "ratingCount": "4358089"
                }
              }
            </script>
          </head>
          <body>
            <div class="BookPageMetadataSection__genres">
              <span class="Button--tag">Fantasy</span>
              <span class="Button--tag">Classics</span>
            </div>
          </body>
        </html>
      `;

      const result = parseGoodreadsBookData(bookHtml);

      assert.strictEqual(result.rating, 4.29);
      assert.strictEqual(result.ratingsCount, 4358089);
      assert.deepStrictEqual(result.genres, ["Fantasy", "Classics"]);
    });

    test("should handle missing rating data gracefully", () => {
      const bookHtml = `
        <html>
          <body>
            <div>No rating information</div>
          </body>
        </html>
      `;

      const result = parseGoodreadsBookData(bookHtml);

      assert.strictEqual(result.rating, null);
      assert.strictEqual(result.ratingsCount, null);
      assert.deepStrictEqual(result.genres, []);
    });

    test("should handle malformed JSON-LD gracefully", () => {
      const bookHtml = `
        <html>
          <head>
            <script type="application/ld+json">
              { invalid json
            </script>
          </head>
          <body>
            <div class="RatingStatistics__rating">3.75</div>
            <div class="RatingStatistics__meta">2,500 ratings</div>
          </body>
        </html>
      `;

      const result = parseGoodreadsBookData(bookHtml);

      // Should fall back to HTML parsing
      assert.strictEqual(result.rating, 3.75);
      assert.strictEqual(result.ratingsCount, 2500);
    });

    test("should prefer JSON-LD over HTML elements", () => {
      const bookHtml = `
        <html>
          <head>
            <script type="application/ld+json">
              {
                "aggregateRating": {
                  "ratingValue": "4.50",
                  "ratingCount": "10000"
                }
              }
            </script>
          </head>
          <body>
            <div class="RatingStatistics__rating">3.00</div>
            <div class="RatingStatistics__meta">5,000 ratings</div>
          </body>
        </html>
      `;

      const result = parseGoodreadsBookData(bookHtml);

      // Should use JSON-LD values, not HTML values
      assert.strictEqual(result.rating, 4.5);
      assert.strictEqual(result.ratingsCount, 10000);
    });
  });

  describe("extractGenres", () => {
    test("should extract genres from Button--tag elements", () => {
      const html = `
        <div class="BookPageMetadataSection__genres">
          <span class="Button--tag">Fantasy</span>
          <span class="Button--tag">Fiction</span>
          <span class="Button--tag">Adventure</span>
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      assert.deepStrictEqual(result, ["Fantasy", "Fiction", "Adventure"]);
    });

    test("should extract genres from alternative selectors", () => {
      const html = `
        <div class="genres">
          <a class="actionLinkLite bookPageGenreLink">Science Fiction</a>
          <a class="actionLinkLite bookPageGenreLink">Dystopian</a>
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      assert.deepStrictEqual(result, ["Science Fiction", "Dystopian"]);
    });

    test("should limit genres to maximum count", () => {
      const html = `
        <div class="BookPageMetadataSection__genres">
          <span class="Button--tag">Fantasy</span>
          <span class="Button--tag">Fiction</span>
          <span class="Button--tag">Adventure</span>
          <span class="Button--tag">Young Adult</span>
          <span class="Button--tag">High Fantasy</span>
          <span class="Button--tag">Classics</span>
          <span class="Button--tag">Literature</span>
          <span class="Button--tag">Magic</span>
          <span class="Button--tag">Dragons</span>
          <span class="Button--tag">Epic Fantasy</span>
          <span class="Button--tag">Medieval</span>
          <span class="Button--tag">Quest</span>
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      assert.ok(result.length <= 10, "Should limit genres to maximum count");
      assert.ok(result.includes("Fantasy"), "Should include primary genre");
    });

    test("should filter out non-genre terms", () => {
      const html = `
        <div class="BookPageMetadataSection__genres">
          <span class="Button--tag">Fantasy</span>
          <span class="Button--tag">Fiction</span>
          <span class="Button--tag">...more</span>
          <span class="Button--tag">Audiobook</span>
          <span class="Button--tag">Kindle</span>
          <span class="Button--tag">Adventure</span>
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      // Should not include technical terms
      assert.ok(!result.includes("...more"), "Should filter out '...more'");
      assert.ok(!result.includes("Audiobook"), "Should filter out 'Audiobook'");
      assert.ok(!result.includes("Kindle"), "Should filter out 'Kindle'");

      // Should include actual genres
      assert.ok(result.includes("Fantasy"), "Should include Fantasy");
      assert.ok(result.includes("Fiction"), "Should include Fiction");
      assert.ok(result.includes("Adventure"), "Should include Adventure");
    });

    test("should extract from CollapsableList text format", () => {
      const html = `
        <div class="BookPageMetadataSection__genres">
          GenresFantasyFictionYoung AdultMagicChildrens...more...
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      // Should find known genres in the text
      assert.ok(result.includes("Fantasy"), "Should find Fantasy");
      assert.ok(result.includes("Fiction"), "Should find Fiction");
      assert.ok(result.includes("Young Adult"), "Should find Young Adult");
      assert.ok(result.includes("Magic"), "Should find Magic");
    });

    test("should fallback to shelf tags when no genre buttons found", () => {
      const html = `
        <div class="shelfStat">
          <div class="shelfName">fantasy</div>
        </div>
        <div class="shelfStat">
          <div class="shelfName">science-fiction</div>
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      assert.ok(result.includes("fantasy"), "Should include shelf genre");
      assert.ok(
        result.includes("science-fiction"),
        "Should include shelf genre",
      );
    });

    test("should handle no genres found", () => {
      const html = `<div>No genre information</div>`;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      assert.deepStrictEqual(result, []);
    });

    test("should remove duplicate genres", () => {
      const html = `
        <div class="BookPageMetadataSection__genres">
          <span class="Button--tag">Fantasy</span>
          <span class="Button--tag">Fantasy</span>
          <span class="Button--tag">Fiction</span>
        </div>
      `;
      const $ = cheerio.load(html);

      const result = extractGenres($);

      assert.deepStrictEqual(result, ["Fantasy", "Fiction"]);
    });
  });

  describe("validateRating", () => {
    test("should validate valid rating and count", () => {
      const result = validateRating(4.25, 5000);

      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.validatedRating, 4.25);
      assert.strictEqual(result.validatedCount, 5000);
    });

    test("should reject rating outside valid range", () => {
      const tooLow = validateRating(-1, 1000);
      const tooHigh = validateRating(6, 1000);

      assert.strictEqual(tooLow.isValid, false);
      assert.strictEqual(tooHigh.isValid, false);
    });

    test("should reject rating with zero ratings count", () => {
      const result = validateRating(4.5, 0);

      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.validatedRating, null);
      assert.strictEqual(result.validatedCount, 0);
    });

    test("should handle null rating", () => {
      const result = validateRating(null, 1000);

      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.validatedRating, null);
      assert.strictEqual(result.validatedCount, 1000);
    });

    test("should handle null ratings count", () => {
      const result = validateRating(4.5, null);

      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.validatedRating, null);
      assert.strictEqual(result.validatedCount, null);
    });

    test("should handle NaN values", () => {
      const result = validateRating(Number.NaN, Number.NaN);

      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.validatedRating, null);
      assert.strictEqual(result.validatedCount, null);
    });

    test("should validate edge case ratings", () => {
      const minValid = validateRating(0, 1);
      const maxValid = validateRating(5, 1);

      assert.strictEqual(minValid.isValid, true);
      assert.strictEqual(maxValid.isValid, true);
    });
  });

  describe("Integration tests with real fixture", () => {
    test("should extract meaningful data from real Goodreads fixture", () => {
      const goodreadsHtml = loadFixture("goodreads-sample.html");

      const result = parseGoodreadsBookData(goodreadsHtml);

      console.log("Real fixture extraction result:", result);

      // Basic checks - at least some meaningful data should be extracted
      const hasRatingData =
        result.rating !== null || result.ratingsCount !== null;
      const hasGenres = result.genres.length > 0;

      assert.ok(
        hasRatingData || hasGenres,
        "Should extract at least some meaningful data from real Goodreads fixture",
      );

      // If rating is present, it should be valid
      if (result.rating !== null) {
        assert.ok(
          result.rating >= 0 && result.rating <= 5,
          "Rating should be in valid range",
        );
      }

      // If ratings count is present, it should be positive
      if (result.ratingsCount !== null) {
        assert.ok(
          result.ratingsCount >= 0,
          "Ratings count should be non-negative",
        );
      }

      // Genres should be strings
      assert.ok(
        result.genres.every((genre) => typeof genre === "string"),
        "All genres should be strings",
      );
    });

    test("should handle search results fixture", () => {
      // Test if we have a search results fixture
      try {
        const searchHtml = loadFixture("goodreads-search-sample.html");
        const result = findBookLinkFromSearch(searchHtml);

        console.log("Search fixture result:", result);

        if (result !== null) {
          assert.ok(
            result.includes("/book/show/"),
            "Should extract valid book link pattern",
          );
        }
      } catch (error) {
        // If fixture doesn't exist, test with synthetic data
        console.log("No search fixture found, using synthetic test data");

        const syntheticSearchHtml = `
          <html>
            <body>
              <a class="bookTitle" href="/book/show/12345.Test_Book">Test Book</a>
            </body>
          </html>
        `;

        const result = findBookLinkFromSearch(syntheticSearchHtml);
        assert.strictEqual(result, "/book/show/12345.Test_Book");
      }
    });
  });

  describe("Roman numeral fallback functionality", () => {
    test("should use fallback search when original title fails", () => {
      // This is a unit test for the logic, not integration test
      // We'll test the fallback logic by checking the search queries generated
      const book = {
        title: "Jih proti Severu (II)",
        author: "Mitchell, Margaret",
      };

      // Test that getTitleWithArabicNumerals creates the expected fallback
      const fallbackTitle = getTitleWithArabicNumerals(book.title);

      assert.strictEqual(
        fallbackTitle,
        "Jih proti Severu 2",
        "Should convert Roman numeral to Arabic",
      );
      assert.notStrictEqual(
        book.title,
        fallbackTitle,
        "Original and fallback should be different",
      );
    });

    test("should not attempt fallback when title has no Roman numerals", () => {
      const titleWithoutRoman = "Simple Book Title";
      const fallbackTitle = getTitleWithArabicNumerals(titleWithoutRoman);

      assert.strictEqual(
        titleWithoutRoman,
        fallbackTitle,
        "Should not change titles without Roman numerals",
      );
    });

    test("should handle various Roman numeral formats in fallback", () => {
      const testCases = [
        { input: "Book (I)", expected: "Book 1" },
        { input: "Book (II)", expected: "Book 2" },
        { input: "Book (III)", expected: "Book 3" },
        { input: "Book (IV)", expected: "Book 4" },
        { input: "Book (V)", expected: "Book 5" },
        { input: "Book (VI)", expected: "Book 6" },
        { input: "Book (VII)", expected: "Book 7" },
        { input: "Book (VIII)", expected: "Book 8" },
        { input: "Book (IX)", expected: "Book 9" },
        { input: "Book (X)", expected: "Book 10" },
      ];

      for (const testCase of testCases) {
        const result = getTitleWithArabicNumerals(testCase.input);
        assert.strictEqual(
          result,
          testCase.expected,
          `Failed for ${testCase.input}`,
        );
      }
    });

    test("should preserve original search behavior for titles without parentheses", () => {
      // Test that our changes don't break normal title cleaning
      const normalTitle = "Harry Potter and the Philosopher's Stone";
      const cleaned = cleanSearchTerm(normalTitle);

      assert.strictEqual(
        cleaned,
        "Harry Potter and the Philosopher s Stone",
        "Should clean normally",
      );
    });

    test("should clean both original and fallback titles properly", () => {
      const originalTitle = "Jih proti Severu (II)";
      const fallbackTitle = getTitleWithArabicNumerals(originalTitle);

      const cleanedOriginal = cleanSearchTerm(originalTitle);
      const cleanedFallback = cleanSearchTerm(fallbackTitle);

      assert.strictEqual(
        cleanedOriginal,
        "Jih proti Severu II",
        "Should clean original title",
      );
      assert.strictEqual(
        cleanedFallback,
        "Jih proti Severu 2",
        "Should clean fallback title",
      );
      assert.notStrictEqual(
        cleanedOriginal,
        cleanedFallback,
        "Cleaned versions should differ",
      );
    });
  });
});
