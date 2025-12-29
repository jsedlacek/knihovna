import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { deduplicateBooks } from "./book-deduplication.ts";

/**
 * Helper function to create a test book with minimal required fields
 */
function createTestBook(overrides: Partial<Book> = {}): Book {
  return {
    title: "Test Book",
    partTitle: null,
    author: "Test Author",
    publisher: "Test Publisher",
    year: null,
    imageUrl: null,
    detailUrl: "https://example.com/book",
    pdfUrl: null,
    epubUrl: null,
    description: "Test description",
    genreId: null,
    genre: null,
    rating: 4.0,
    ratingsCount: 100,
    url: "https://example.com/book",
    mlpScrapedAt: "2025-01-01T00:00:00.000Z",
    goodreadsScrapedAt: "2025-01-01T00:00:00.000Z",
    subtitle: null,
    ...overrides,
  };
}

describe("Book Deduplication", () => {
  describe("No duplicates", () => {
    test("should return original array when no duplicates exist", () => {
      const books = [
        createTestBook({ title: "Book A", author: "Author A" }),
        createTestBook({ title: "Book B", author: "Author B" }),
        createTestBook({ title: "Book C", author: "Author C" }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, books);
    });

    test("should return empty array when input is empty", () => {
      const result = deduplicateBooks([]);
      assert.strictEqual(result.length, 0);
    });
  });

  describe("Roman numeral normalization", () => {
    test("should deduplicate books with Roman vs Arabic numerals in title", () => {
      const books = [
        createTestBook({
          title: "O umění a kultuře (I)",
          author: "Čapek, Karel",
          year: 2018,
        }),
        createTestBook({
          title: "O umění a kultuře (1)",
          author: "Čapek, Karel",
          year: null,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0]?.year, 2018, "Should keep the book with year");
      assert.strictEqual(result[0]?.title, "O umění a kultuře (I)");
    });

    test("should handle various Roman numeral formats", () => {
      const books = [
        createTestBook({ title: "Book (II)", year: 2020 }),
        createTestBook({ title: "Book (2)", year: 2019 }),
        createTestBook({ title: "Book (III)", year: 2021 }),
        createTestBook({ title: "Book (3)", year: null }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 2);

      // Should keep the newer book for each Roman/Arabic pair
      const book2 = result.find(
        (book) => book.title.includes("(II)") || book.title.includes("(2)"),
      );
      const book3 = result.find(
        (book) => book.title.includes("(III)") || book.title.includes("(3)"),
      );

      assert.ok(book2);
      assert.ok(book3);
      assert.strictEqual(book2.year, 2020, "Should keep 2020 over 2019 for book 2");
      assert.strictEqual(book3.year, 2021, "Should keep 2021 over null for book 3");
    });

    test("should handle complex Roman numerals", () => {
      const books = [
        createTestBook({ title: "Harry Potter (VII)", year: 2007 }),
        createTestBook({ title: "Harry Potter (7)", year: 2006 }),
        createTestBook({ title: "Chronicles (XIV)", year: 2015 }),
        createTestBook({ title: "Chronicles (14)", year: null }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 2);

      const harryPotter = result.find((book) => book.title.includes("Harry Potter"));
      const chronicles = result.find((book) => book.title.includes("Chronicles"));

      assert.ok(harryPotter);
      assert.ok(chronicles);
      assert.strictEqual(harryPotter.year, 2007);
      assert.strictEqual(chronicles.year, 2015);
    });

    test("should handle Roman numerals in different positions", () => {
      const books = [
        createTestBook({ title: "Part III: The End", year: 2020 }),
        createTestBook({ title: "Part 3: The End", year: 2019 }),
        createTestBook({ title: "Volume V Complete", year: 2021 }),
        createTestBook({ title: "Volume 5 Complete", year: null }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 2);
    });
  });

  describe("Year-based deduplication", () => {
    test("should keep newer book when years differ", () => {
      const books = [
        createTestBook({ title: "Same Book", year: 2020 }),
        createTestBook({ title: "Same Book", year: 2022 }),
        createTestBook({ title: "Same Book", year: 2018 }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0]?.year, 2022, "Should keep the newest book");
    });

    test("should prefer book with year over book without year", () => {
      const books = [
        createTestBook({ title: "Same Book", year: null }),
        createTestBook({ title: "Same Book", year: 2020 }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0]?.year, 2020, "Should keep book with year");
    });

    test("should keep all books when no years are available", () => {
      const books = [
        createTestBook({ title: "Same Book", year: null }),
        createTestBook({ title: "Same Book", year: null }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 2, "Should keep all books when no years available");
    });

    test("should keep all books when multiple books have same newest year", () => {
      const books = [
        createTestBook({ title: "Same Book", year: 2020 }),
        createTestBook({ title: "Same Book", year: 2020 }),
        createTestBook({ title: "Same Book", year: 2018 }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 2, "Should keep both books from 2020");
      assert.ok(
        result.every((book) => book.year === 2020),
        "All kept books should be from 2020",
      );
    });
  });

  describe("Subtitle and partTitle handling", () => {
    test("should treat books with different subtitles as different", () => {
      const books = [
        createTestBook({ title: "Main Title", subtitle: "Part One" }),
        createTestBook({ title: "Main Title", subtitle: "Part Two" }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        2,
        "Books with different subtitles should not be deduplicated",
      );
    });

    test("should treat books with different partTitles as different", () => {
      const books = [
        createTestBook({ title: "Main Title", partTitle: "Chapter 1" }),
        createTestBook({ title: "Main Title", partTitle: "Chapter 2" }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        2,
        "Books with different partTitles should not be deduplicated",
      );
    });

    test("should deduplicate books with same subtitle", () => {
      const books = [
        createTestBook({
          title: "Main Title",
          subtitle: "Same Subtitle",
          year: 2020,
        }),
        createTestBook({
          title: "Main Title",
          subtitle: "Same Subtitle",
          year: 2019,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0]?.year, 2020);
    });

    test("should handle null vs empty string in subtitle/partTitle", () => {
      const books = [
        createTestBook({
          title: "Same Title",
          subtitle: null,
          partTitle: null,
          year: 2020,
        }),
        createTestBook({
          title: "Same Title",
          subtitle: "",
          partTitle: "",
          year: 2019,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1, "null and empty string should be treated as equivalent");
      assert.strictEqual(result[0]?.year, 2020, "Should keep the newer book");
    });
  });

  describe("Author normalization", () => {
    test("should handle different author formatting", () => {
      const books = [
        createTestBook({
          title: "Same Book",
          author: "Čapek, Karel",
          year: 2020,
        }),
        createTestBook({
          title: "Same Book",
          author: "čapek, karel",
          year: 2019,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Case differences in author should not prevent deduplication",
      );
      assert.strictEqual(result[0]?.year, 2020);
    });

    test("should handle punctuation differences in author names", () => {
      const books = [
        createTestBook({
          title: "Same Book",
          author: "Tolkien, J.R.R.",
          year: 2020,
        }),
        createTestBook({
          title: "Same Book",
          author: "Tolkien, J R R",
          year: 2019,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Punctuation differences should not prevent deduplication",
      );
    });
  });

  describe("Title normalization", () => {
    test("should handle punctuation differences in titles", () => {
      const books = [
        createTestBook({ title: "Book: A Story", year: 2020 }),
        createTestBook({ title: "Book A Story", year: 2019 }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Punctuation differences should not prevent deduplication",
      );
    });

    test("should handle whitespace differences", () => {
      const books = [
        createTestBook({ title: "Book   Title", year: 2020 }),
        createTestBook({ title: "Book Title", year: 2019 }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Whitespace differences should not prevent deduplication",
      );
    });

    test("should handle special characters", () => {
      const books = [
        createTestBook({ title: 'Book "Title"', year: 2020 }),
        createTestBook({ title: "Book Title", year: 2019 }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Special quote characters should not prevent deduplication",
      );
    });
  });

  describe("Diacritic normalization", () => {
    test("should deduplicate books with diacritic differences", () => {
      const books = [
        createTestBook({
          title: "O věcech obecných čili Zóon polítikon",
          partTitle: null,
          author: "Čapek, Karel",
          publisher: "Městská knihovna v Praze",
          year: null,
          imageUrl: null,
          detailUrl:
            "https://search.mlp.cz/cz/titul/o-vecech-obecnych-cili-zoon-politikon/3347551/",
          pdfUrl:
            "https://web2.mlp.cz/koweb/00/03/34/75/51/o_vecech_obecnych_cili_zoon_politikon.pdf",
          epubUrl:
            "https://web2.mlp.cz/koweb/00/03/34/75/51/o_vecech_obecnych_cili_zoon_politikon.epub",
          description:
            "Čapkovské úvahy o politice, společnosti, civilizaci, kultuře jsou svižným i úsměvným zamyšlením nad věcmi a jevy kolem nás.",
          rating: 4.22,
          ratingsCount: 50,
          url: "https://www.goodreads.com/book/show/17832817-o-v-cech-obecn-ch-ili-z-on-politikon?from_search=true&from_srp=true&qid=FvR95mRHnh&rank=1",

          mlpScrapedAt: "2025-08-17T22:20:45.569Z",
          goodreadsScrapedAt: "2025-08-17T22:21:18.768Z",
          subtitle: null,
        }),
        createTestBook({
          title: "O věcech obecných, čili, Zoon politikon",
          partTitle: null,
          author: "Čapek, Karel",
          publisher: "Městská knihovna v Praze",
          year: 2018,
          imageUrl: "https://web2.mlp.cz/koweb/00/04/37/75/30.jpg",
          detailUrl:
            "https://search.mlp.cz/cz/titul/o-vecech-obecnych-cili-zoon-politikon/4377530/",
          pdfUrl:
            "https://web2.mlp.cz/koweb/00/04/37/75/30/o_vecech_obecnych_cili_zoon_politikon.pdf",
          epubUrl:
            "https://web2.mlp.cz/koweb/00/04/37/75/30/o_vecech_obecnych_cili_zoon_politikon.epub",
          description:
            "Čapkovské úvahy o politice, společnosti, civilizaci, kultuře jsou svižným i úsměvným zamyšlením nad věcmi a jevy kolem nás.",
          rating: 4.22,
          ratingsCount: 50,
          url: "https://www.goodreads.com/book/show/17832817-o-v-cech-obecn-ch-ili-z-on-politikon?from_search=true&from_srp=true&qid=Uo0U1NjaF7&rank=1",

          mlpScrapedAt: "2025-08-17T22:20:15.751Z",
          goodreadsScrapedAt: "2025-08-17T22:21:15.359Z",
          subtitle: null,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1, "Should deduplicate books with diacritic differences");
      assert.strictEqual(result[0]?.year, 2018, "Should keep the version with year (2018)");
      assert.strictEqual(
        result[0]?.title,
        "O věcech obecných, čili, Zoon politikon",
        "Should keep the newer version",
      );
    });

    test("should handle various diacritic differences", () => {
      const books = [
        createTestBook({
          title: "Příběh s háčky a čárkami",
          author: "Tëst Authör",
          year: 2020,
        }),
        createTestBook({
          title: "Pribeh s hacky a carkami",
          author: "Test Author",
          year: 2019,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Should deduplicate books with various diacritic differences",
      );
      assert.strictEqual(result[0]?.year, 2020);
    });
  });

  describe("Real-world example", () => {
    test("should handle the Čapek O umění a kultuře example correctly", () => {
      const books = [
        createTestBook({
          title: "O umění a kultuře (I)",
          partTitle: null,
          author: "Čapek, Karel",
          publisher: "Městská knihovna v Praze",
          year: 2018,
          imageUrl: "https://web2.mlp.cz/koweb/00/04/34/55/25.jpg",
          detailUrl: "https://search.mlp.cz/cz/titul/o-umeni-a-kulture/4345525/",
          pdfUrl: "https://web2.mlp.cz/koweb/00/04/34/55/25/o_umeni_a_kulture_i.pdf",
          epubUrl: "https://web2.mlp.cz/koweb/00/04/34/55/25/o_umeni_a_kulture_i.epub",
          description:
            "První ze 3 dílů souboru Čapkovy kulturně publicistické činnosti obsahuje jeho novinářskou a časopiseckou tvorbu zabývající se uměním a kulturou z let 1907-1918.",
          rating: 5,
          ratingsCount: 3,
          url: "https://www.goodreads.com/book/show/18142119-o-um-n-a-kultu-e-i?from_search=true&from_srp=true&qid=Ebclpttn2s&rank=1",

          mlpScrapedAt: "2025-08-17T22:20:07.515Z",
          goodreadsScrapedAt: "2025-08-17T22:21:14.569Z",
          subtitle: null,
        }),
        createTestBook({
          title: "O umění a kultuře (1)",
          partTitle: null,
          author: "Čapek, Karel",
          publisher: "Městská knihovna v Praze",
          year: null,
          imageUrl: null,
          detailUrl: "https://search.mlp.cz/cz/titul/o-umeni-a-kulture/3347611/",
          pdfUrl: "https://web2.mlp.cz/koweb/00/03/34/76/11/o_umeni_a_kulture_i.pdf",
          epubUrl: "https://web2.mlp.cz/koweb/00/03/34/76/11/o_umeni_a_kulture_i.epub",
          description:
            "První ze 3 dílů obsahuje Čapkovu novinářskou a časopiseckou tvorbu zabývající se uměním a kulturou z let 1907-1918.",
          rating: 5,
          ratingsCount: 3,
          url: "https://www.goodreads.com/book/show/18142119-o-um-n-a-kultu-e-i?from_search=true&from_srp=true&qid=JEeuqOQw53&rank=1",

          mlpScrapedAt: "2025-08-17T22:20:57.811Z",
          goodreadsScrapedAt: "2025-08-17T22:21:20.250Z",
          subtitle: null,
        }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        1,
        "Should deduplicate the Roman vs Arabic numeral versions",
      );
      assert.strictEqual(result[0]?.year, 2018, "Should keep the version with year (2018)");
      assert.strictEqual(
        result[0]?.title,
        "O umění a kultuře (I)",
        "Should keep the Roman numeral version",
      );
      assert.ok(result[0]?.imageUrl, "Should keep the version with more complete data");
    });
  });

  describe("Edge cases", () => {
    test("should handle single book", () => {
      const books = [createTestBook()];
      const result = deduplicateBooks(books);

      assert.strictEqual(result.length, 1);
      assert.deepStrictEqual(result[0], books[0]);
    });

    test("should preserve all book properties in result", () => {
      const originalBook = createTestBook({
        title: "Complex Book",
        author: "Complex Author",
        year: 2020,
        rating: 4.5,
        ratingsCount: 1500,

        description: "A complex description",
      });

      const result = deduplicateBooks([originalBook]);

      assert.strictEqual(result.length, 1);
      assert.deepStrictEqual(result[0], originalBook, "All properties should be preserved");
    });

    test("should handle books with very similar but not identical content", () => {
      const books = [
        createTestBook({ title: "Almost Same Book", author: "Author A" }),
        createTestBook({ title: "Almost Same Book", author: "Author B" }),
      ];

      const result = deduplicateBooks(books);

      assert.strictEqual(
        result.length,
        2,
        "Books with different authors should not be deduplicated",
      );
    });
  });
});
