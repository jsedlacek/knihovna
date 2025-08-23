import assert from "node:assert";
import { test } from "node:test";
import {
  calculateSimilarity,
  cleanSearchTerm,
  formatAuthorName,
  getAuthorForSearch,
  getTitleWithArabicNumerals,
  romanToArabic,
} from "./text-utils.ts";

test("romanToArabic - converts Roman numerals to Arabic numbers", () => {
  assert.strictEqual(romanToArabic("I"), 1, "Should convert I to 1");
  assert.strictEqual(romanToArabic("IV"), 4, "Should convert IV to 4");
  assert.strictEqual(romanToArabic("IX"), 9, "Should convert IX to 9");
  assert.strictEqual(romanToArabic("XIV"), 14, "Should convert XIV to 14");
  assert.strictEqual(romanToArabic("XX"), 20, "Should convert XX to 20");
  assert.strictEqual(
    romanToArabic("invalid"),
    0,
    "Should return 0 for invalid input",
  );
  assert.strictEqual(romanToArabic(""), 0, "Should return 0 for empty string");
});

test("cleanSearchTerm - removes special characters and normalizes whitespace", () => {
  assert.strictEqual(
    cleanSearchTerm("Hello, World!"),
    "Hello World",
    "Should remove punctuation",
  );

  assert.strictEqual(
    cleanSearchTerm("Test:   Multiple    Spaces"),
    "Test Multiple Spaces",
    "Should normalize whitespace",
  );

  assert.strictEqual(
    cleanSearchTerm("Název s česká písmena"),
    "Název s česká písmena",
    "Should preserve Unicode letters",
  );

  assert.strictEqual(
    cleanSearchTerm("Book (II) - Part 2"),
    "Book II Part 2",
    "Should remove parentheses and dashes but keep Roman numerals",
  );
});

test("getTitleWithArabicNumerals - converts Roman numerals in parentheses", () => {
  assert.strictEqual(
    getTitleWithArabicNumerals("Jih proti Severu (II)"),
    "Jih proti Severu 2",
    "Should convert (II) to 2",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Harry Potter (VII)"),
    "Harry Potter 7",
    "Should convert (VII) to 7",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Star Wars (IV)"),
    "Star Wars 4",
    "Should convert (IV) to 4",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book Title (IX)"),
    "Book Title 9",
    "Should convert (IX) to 9",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Simple Title"),
    "Simple Title",
    "Should leave titles without Roman numerals unchanged",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (ABC)"),
    "Book (ABC)",
    "Should leave non-Roman numerals in parentheses unchanged",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book II"),
    "Book II",
    "Should only convert Roman numerals in parentheses, not standalone",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (i)"),
    "Book 1",
    "Should handle lowercase Roman numerals",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (Xi)"),
    "Book 11",
    "Should handle mixed case Roman numerals",
  );
});

test("getTitleWithArabicNumerals - handles complex Roman numerals", () => {
  assert.strictEqual(
    getTitleWithArabicNumerals("Book (XIV)"),
    "Book 14",
    "Should convert (XIV) to 14",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (XIX)"),
    "Book 19",
    "Should convert (XIX) to 19",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (XLIV)"),
    "Book 44",
    "Should convert (XLIV) to 44",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (MCMXC)"),
    "Book 1990",
    "Should convert (MCMXC) to 1990",
  );
});

test("getTitleWithArabicNumerals - handles invalid Roman numerals", () => {
  assert.strictEqual(
    getTitleWithArabicNumerals("Book (XYZ)"),
    "Book (XYZ)",
    "Should leave invalid Roman numerals unchanged",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book (VV)"),
    "Book (VV)",
    "Should leave invalid Roman numeral combinations unchanged",
  );

  assert.strictEqual(
    getTitleWithArabicNumerals("Book ()"),
    "Book ()",
    "Should handle empty parentheses",
  );
});

test("getAuthorForSearch - extracts surname for search", () => {
  assert.strictEqual(
    getAuthorForSearch("Mitchell, Margaret"),
    "Mitchell",
    "Should extract surname from comma-separated format",
  );

  assert.strictEqual(
    getAuthorForSearch("Tolkien, J. R. R."),
    "Tolkien",
    "Should extract surname with initials",
  );

  assert.strictEqual(
    getAuthorForSearch("Stephen King"),
    "Stephen King",
    "Should return full name if no comma present",
  );

  assert.strictEqual(
    getAuthorForSearch("Čapek, Karel"),
    "Čapek",
    "Should handle Czech names with diacritics",
  );
});

test("formatAuthorName - converts from Last, First to First Last format", () => {
  assert.strictEqual(
    formatAuthorName("Mitchell, Margaret"),
    "Margaret Mitchell",
    "Should convert Last, First to First Last",
  );

  assert.strictEqual(
    formatAuthorName("Tolkien, J. R. R."),
    "J. R. R. Tolkien",
    "Should handle names with initials",
  );

  assert.strictEqual(
    formatAuthorName("Stephen King"),
    "Stephen King",
    "Should leave names without comma unchanged",
  );

  assert.strictEqual(
    formatAuthorName("Čapek, Karel"),
    "Karel Čapek",
    "Should handle Czech names",
  );

  assert.strictEqual(formatAuthorName(""), "", "Should handle empty string");

  assert.strictEqual(
    formatAuthorName("Smith,"),
    "Smith,",
    "Should handle malformed name with trailing comma",
  );
});

test("calculateSimilarity - computes Jaro-Winkler similarity", () => {
  assert.strictEqual(
    calculateSimilarity("hello", "hello"),
    1.0,
    "Identical strings should have similarity of 1.0",
  );

  assert.strictEqual(
    calculateSimilarity("", ""),
    1.0,
    "Empty strings should have similarity of 1.0",
  );

  assert.strictEqual(
    calculateSimilarity("hello", ""),
    0.0,
    "Empty string vs non-empty should have similarity of 0.0",
  );

  assert.strictEqual(
    calculateSimilarity("", "hello"),
    0.0,
    "Non-empty vs empty string should have similarity of 0.0",
  );

  // Test approximate similarity
  const similarity = calculateSimilarity("mitchell", "michel");
  assert.ok(
    similarity > 0.8 && similarity < 1.0,
    `Similar strings should have high similarity, got ${similarity}`,
  );

  const lowSimilarity = calculateSimilarity("hello", "world");
  assert.ok(
    lowSimilarity < 0.5,
    `Dissimilar strings should have low similarity, got ${lowSimilarity}`,
  );
});

test("Integration test - cleanSearchTerm and getTitleWithArabicNumerals work together", () => {
  const originalTitle = "Jih proti Severu (II)";
  const fallbackTitle = getTitleWithArabicNumerals(originalTitle);

  assert.strictEqual(fallbackTitle, "Jih proti Severu 2");

  const cleanedOriginal = cleanSearchTerm(originalTitle);
  const cleanedFallback = cleanSearchTerm(fallbackTitle);

  assert.strictEqual(cleanedOriginal, "Jih proti Severu II");
  assert.strictEqual(cleanedFallback, "Jih proti Severu 2");

  assert.notStrictEqual(
    cleanedOriginal,
    cleanedFallback,
    "Cleaned versions should be different, enabling fallback search",
  );
});
