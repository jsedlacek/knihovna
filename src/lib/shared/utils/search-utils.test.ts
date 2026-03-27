import { describe, it } from "node:test";
import assert from "node:assert/strict";

import type { Book } from "#@/lib/shared/types/book-types.ts";
import { searchBooks } from "./search-utils.ts";

function makeBook(overrides: Partial<Book> & { title: string; author: string }): Book {
  return {
    titulKey: 1,
    detailUrl: "",
    publisher: null,
    year: null,
    subtitle: null,
    partTitle: null,
    imageUrl: null,
    imageWidth: null,
    imageHeight: null,
    description: null,
    pdfUrl: null,
    epubUrl: null,
    genreId: null,
    genre: null,
    authorKey: null,
    rating: null,
    ratingsCount: null,
    url: null,
    mlpScrapedAt: null,
    goodreadsScrapedAt: null,
    ...overrides,
  };
}

const books: Book[] = [
  makeBook({ titulKey: 1, title: "Válka s mloky", author: "Čapek, Karel" }),
  makeBook({ titulKey: 2, title: "R.U.R.", author: "Čapek, Karel" }),
  makeBook({ titulKey: 3, title: "Babička", author: "Němcová, Božena" }),
  makeBook({ titulKey: 4, title: "Máj", author: "Mácha, Karel Hynek" }),
];

describe("searchBooks", () => {
  it("returns empty for empty query", async () => {
    const result = await searchBooks(books, "");
    assert.equal(result.length, 0);
  });

  it("returns empty for short query", async () => {
    const result = await searchBooks(books, "a");
    assert.equal(result.length, 0);
  });

  it("returns empty for whitespace-only query", async () => {
    const result = await searchBooks(books, "   ");
    assert.equal(result.length, 0);
  });

  it("finds books by title", async () => {
    const result = await searchBooks(books, "Babička");
    assert.ok(result.some((b) => b.titulKey === 3));
  });

  it("finds books by author without diacritics", async () => {
    const result = await searchBooks(books, "capek");
    assert.ok(result.length >= 1);
    assert.ok(result.some((b) => b.author === "Čapek, Karel"));
  });

  it("finds books with typo tolerance", async () => {
    const result = await searchBooks(books, "Kapek");
    assert.ok(result.some((b) => b.author === "Čapek, Karel"));
  });

  it("returns empty for non-matching query", async () => {
    const result = await searchBooks(books, "neexistujici");
    assert.equal(result.length, 0);
  });
});
