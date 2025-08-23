import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import {
  applyBookFixups,
  applyBookFixupsToArray,
  getConfiguredFixups,
  hasFixup,
} from "./book-fixup-utils.ts";

describe("Book Fixup Utils", () => {
  // Create a sample book for testing
  const createSampleBook = (overrides: Partial<Book> = {}): Book => ({
    title: "Original Title",
    author: "Original Author",
    publisher: "Original Publisher",
    year: 2020,
    detailUrl: "https://search.mlp.cz/cz/titul/test-book/123456/",
    subtitle: "Original Subtitle",
    partTitle: null,
    imageUrl: "https://example.com/image.jpg",
    description: "Original description",
    pdfUrl: "https://example.com/book.pdf",
    epubUrl: "https://example.com/book.epub",
    genreId: "F1a2b",
    genre: "Fiction for adults",
    rating: 4.5,
    ratingsCount: 100,
    url: "https://goodreads.com/book/123",
    mlpScrapedAt: new Date().toISOString(),
    goodreadsScrapedAt: new Date().toISOString(),
    ...overrides,
  });

  test("applyBookFixups returns original book when no fixup exists", () => {
    const book = createSampleBook({
      detailUrl: "https://search.mlp.cz/cz/titul/no-fixup/999999/",
    });

    const result = applyBookFixups(book);

    assert.deepStrictEqual(result, book);
  });

  test("applyBookFixups applies title correction for known book", () => {
    const book = createSampleBook({
      detailUrl: "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
      title: "České okamžiky",
    });

    const result = applyBookFixups(book);

    assert.strictEqual(result.title, "České snění");
    assert.strictEqual(result.author, book.author); // Other fields unchanged
    assert.strictEqual(result.detailUrl, book.detailUrl);
  });

  test("applyBookFixups preserves all other fields when applying fixups", () => {
    const book = createSampleBook({
      detailUrl: "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
      title: "České okamžiky",
      rating: 4.2,
      ratingsCount: 150,
    });

    const result = applyBookFixups(book);

    // Title should be fixed
    assert.strictEqual(result.title, "České snění");

    // All other fields should be preserved
    assert.strictEqual(result.author, book.author);
    assert.strictEqual(result.publisher, book.publisher);
    assert.strictEqual(result.year, book.year);
    assert.strictEqual(result.subtitle, book.subtitle);
    assert.strictEqual(result.description, book.description);
    assert.strictEqual(result.rating, book.rating);
    assert.strictEqual(result.ratingsCount, book.ratingsCount);

    assert.strictEqual(result.mlpScrapedAt, book.mlpScrapedAt);
    assert.strictEqual(result.goodreadsScrapedAt, book.goodreadsScrapedAt);
  });

  test("applyBookFixupsToArray processes multiple books", () => {
    const books = [
      createSampleBook({
        detailUrl: "https://search.mlp.cz/cz/titul/no-fixup/111111/",
        title: "No Fixup Book",
      }),
      createSampleBook({
        detailUrl: "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
        title: "České okamžiky",
      }),
      createSampleBook({
        detailUrl: "https://search.mlp.cz/cz/titul/another-book/222222/",
        title: "Another Book",
      }),
    ];

    const result = applyBookFixupsToArray(books);

    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0]?.title, "No Fixup Book"); // Unchanged
    assert.strictEqual(result[1]?.title, "České snění"); // Fixed
    assert.strictEqual(result[2]?.title, "Another Book"); // Unchanged
  });

  test("applyBookFixupsToArray returns new array", () => {
    const books = [
      createSampleBook({
        detailUrl: "https://search.mlp.cz/cz/titul/no-fixup/111111/",
      }),
    ];

    const result = applyBookFixupsToArray(books);

    assert.notStrictEqual(result, books); // Should be a new array
    assert.deepStrictEqual(result, books); // But with same content (no fixups applied)
  });

  test("hasFixup returns true for books with configured fixups", () => {
    const result = hasFixup(
      "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
    );
    assert.strictEqual(result, true);
  });

  test("hasFixup returns false for books without fixups", () => {
    const result = hasFixup("https://search.mlp.cz/cz/titul/no-fixup/999999/");
    assert.strictEqual(result, false);
  });

  test("getConfiguredFixups returns array of fixup configurations", () => {
    const fixups = getConfiguredFixups();

    assert.ok(Array.isArray(fixups));
    assert.ok(fixups.length > 0);

    // Check that the known fixup is present
    const czechBookFixup = fixups.find(
      (f) =>
        f.detailUrl ===
        "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
    );

    assert.ok(czechBookFixup);
    assert.strictEqual(czechBookFixup.title, "České snění");
    assert.ok(czechBookFixup.reason.includes("incorrect"));
  });

  test("applyBookFixups handles null and undefined values correctly", () => {
    const book = createSampleBook({
      detailUrl: "https://search.mlp.cz/cz/titul/ceske-okamziky/4359869/",
      subtitle: null,
      partTitle: undefined as any,
    });

    const result = applyBookFixups(book);

    // Should still apply the title fixup
    assert.strictEqual(result.title, "České snění");
    // Null/undefined values should be preserved
    assert.strictEqual(result.subtitle, null);
    assert.strictEqual(result.partTitle, undefined);
  });
});
