import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Book, GoodreadsData } from "#@/lib/shared/types/book-types.ts";

/**
 * Load HTML fixture file for testing
 */
export function loadFixture(filename: string): string {
  const fixturePath = join(import.meta.dirname, "..", "fixtures", filename);
  return readFileSync(fixturePath, "utf-8");
}

/**
 * Create a mock book object for testing
 */
export function createMockBook(overrides: Partial<Book> = {}): Book {
  return {
    title: "Test Book Title",
    author: "Test Author",
    publisher: "Test Publisher",
    year: 2023,
    detailUrl: "https://example.com/book/123",
    subtitle: null,
    partTitle: null,
    imageUrl: null,
    description: null,
    pdfUrl: null,
    epubUrl: null,
    genreId: null,
    genre: null,
    rating: null,
    ratingsCount: null,
    url: null,
    mlpScrapedAt: null,
    goodreadsScrapedAt: null,
    ...overrides,
  };
}

/**
 * Create a mock Goodreads data object for testing
 */
export function createMockGoodreadsData(overrides: Partial<GoodreadsData> = {}): GoodreadsData {
  return {
    rating: 4.5,
    ratingsCount: 1000,
    url: "https://goodreads.com/book/show/123",
    ...overrides,
  };
}

/**
 * Assert that a value is not null or undefined
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || "Expected value to be defined");
  }
}

/**
 * Assert that two arrays contain the same elements (order independent)
 */
export function assertArraysEqual<T>(actual: T[], expected: T[], message?: string): void {
  const sortedActual = [...actual].sort();
  const sortedExpected = [...expected].sort();

  if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
    throw new Error(
      message ||
        `Arrays are not equal. Expected: ${JSON.stringify(sortedExpected)}, Actual: ${JSON.stringify(sortedActual)}`,
    );
  }
}

/**
 * Assert that a string contains a substring
 */
export function assertContains(haystack: string, needle: string, message?: string): void {
  if (!haystack.includes(needle)) {
    throw new Error(message || `Expected "${haystack}" to contain "${needle}"`);
  }
}

/**
 * Assert that a number is within a range
 */
export function assertInRange(value: number, min: number, max: number, message?: string): void {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be between ${min} and ${max}`);
  }
}
