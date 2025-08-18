import { test, describe } from "node:test";
import assert from "node:assert";
import { parseMlpBookDetails, parseMlpDownloadLinks } from "./mlp-scraper.ts";
import { loadFixture } from "#@/test/utils/test-utils.ts";

describe("MLP Scraper HTML Parsing", () => {
  describe("parseMlpBookDetails", () => {
    test("should extract description from real MLP detail page", () => {
      const mlpHtml = loadFixture("mlp-sample.html");

      const result = parseMlpBookDetails(mlpHtml);

      assert.ok(result.description, "Description should be extracted");
      assert.ok(
        result.description.includes("Violoncello") ||
          result.description.includes("Partitur"),
        "Description should contain expected content from fixture",
      );
      console.log("Extracted description:", result.description);
    });

    test("should extract genre information from real MLP fixture", () => {
      const mlpHtml = loadFixture("mlp-sample.html");

      const result = parseMlpBookDetails(mlpHtml);

      assert.strictEqual(
        result.genreId,
        "V7b4e",
        "Should extract genre ID from OCH field",
      );
      assert.ok(result.genre, "Should extract genre from Obsah OCHu field");
      assert.ok(
        result.genre.includes("Sextety") || result.genre.includes("skladby"),
        "Genre should contain expected content from fixture",
      );
      console.log("Extracted genre data:", {
        genreId: result.genreId,
        genre: result.genre,
      });
    });

    test("should handle missing description gracefully", () => {
      const htmlWithoutDescription = `
        <html>
          <body>
            <div class="book-content">
              <p>Some other content</p>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithoutDescription);

      assert.strictEqual(
        result.description,
        null,
        "Should return null when description is missing",
      );
    });

    test("should extract all expected fields including description", () => {
      const htmlWithAllFields = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Název části</td>
                    <td>Test Part Title</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <img class="cover-img" src="/images/test-book.jpg" alt="Book cover" />
            <p class="book-info-preview">This is a comprehensive book description that provides detailed information about the content and scope of this publication.</p>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithAllFields);

      // Test all fields are properly extracted
      assert.strictEqual(result.partTitle, "Test Part Title");
      assert.strictEqual(result.subtitle, null);
      assert.strictEqual(result.imageUrl, "/images/test-book.jpg");
      assert.ok(result.description);
      assert.ok(result.description.includes("comprehensive book description"));
      assert.strictEqual(result.genreId, null);
      assert.strictEqual(result.genre, null);

      console.log("All extracted fields:", result);
    });

    test("should return null for all fields when no relevant content", () => {
      const htmlWithoutRelevantContent = `<html><body><p>No relevant book content</p></body></html>`;

      const result = parseMlpBookDetails(htmlWithoutRelevantContent);

      assert.strictEqual(result.partTitle, null);
      assert.strictEqual(result.subtitle, null);
      assert.strictEqual(result.imageUrl, null);
      assert.strictEqual(result.description, null);
      assert.strictEqual(result.genreId, null);
      assert.strictEqual(result.genre, null);
    });

    test("should handle empty description element", () => {
      const htmlWithEmptyDescription = `
        <html>
          <body>
            <p class="book-info-preview">   </p>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithEmptyDescription);

      assert.strictEqual(
        result.description,
        null,
        "Should return null for whitespace-only description",
      );
    });

    test("should trim whitespace from description", () => {
      const htmlWithWhitespace = `
        <html>
          <body>
            <p class="book-info-preview">

              This description has lots of whitespace.

            </p>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithWhitespace);

      assert.strictEqual(
        result.description,
        "This description has lots of whitespace.",
        "Should trim whitespace from description",
      );
    });

    test("should extract part title from book info table", () => {
      const htmlWithPartTitle = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Název části</td>
                    <td>Volume 1: The Beginning</td>
                  </tr>
                  <tr>
                    <td class="itemlefttd">Other field</td>
                    <td>Other value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithPartTitle);

      assert.strictEqual(result.partTitle, "Volume 1: The Beginning");
      assert.strictEqual(result.subtitle, null);
    });

    test("should extract genre information from book info table", () => {
      const htmlWithGenres = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Obsahová char. "OCH"</td>
                    <td>F1a2b</td>
                  </tr>
                  <tr>
                    <td class="itemlefttd">Obsah OCHu</td>
                    <td>Romány: moderní próza pro dospělé.</td>
                  </tr>
                  <tr>
                    <td class="itemlefttd">Other field</td>
                    <td>Other value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithGenres);

      assert.strictEqual(result.genreId, "F1a2b");
      assert.strictEqual(result.genre, "Romány: moderní próza pro dospělé.");
    });

    test("should handle genre description with multiple parts", () => {
      const htmlWithComplexGenre = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Obsahová char. "OCH"</td>
                    <td>V7b4e</td>
                  </tr>
                  <tr>
                    <td class="itemlefttd">Obsah OCHu</td>
                    <td>Sextety: skladby pro 6 různých nástrojů bez klavíru; komorní hudba; klasická hudba.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithComplexGenre);

      assert.strictEqual(result.genreId, "V7b4e");
      assert.strictEqual(
        result.genre,
        "Sextety: skladby pro 6 různých nástrojů bez klavíru; komorní hudba; klasická hudba.",
      );
    });

    test("should handle missing genre information", () => {
      const htmlWithoutGenres = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Other field</td>
                    <td>Other value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithoutGenres);

      assert.strictEqual(result.genreId, null);
      assert.strictEqual(result.genre, null);
    });

    test("should handle malformed HTML gracefully", () => {
      const malformedHtml = `<html><body><div class="book-content"><table><tbody><tr><td class="itemlefttd">Název části</td></tr></tbody></table></div></body></html>`;

      const result = parseMlpBookDetails(malformedHtml);

      // Should not throw and should return reasonable defaults
      assert.ok(
        typeof result.partTitle === "string" || result.partTitle === null,
      );
      assert.ok(
        typeof result.subtitle === "string" || result.subtitle === null,
      );
      assert.ok(
        typeof result.imageUrl === "string" || result.imageUrl === null,
      );
      assert.ok(
        typeof result.description === "string" || result.description === null,
      );
      assert.ok(typeof result.genreId === "string" || result.genreId === null);
      assert.ok(typeof result.genre === "string" || result.genre === null);
    });
  });

  describe("parseMlpDownloadLinks", () => {
    test("should extract PDF and EPUB download links", () => {
      const reservationHtml = `
        <html>
          <body>
            <div class="download-section">
              <a href="/download/book.pdf" download>Download PDF</a>
              <a href="/download/book.epub" download>Download EPUB</a>
              <a href="/other/link.html">Regular link</a>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpDownloadLinks(reservationHtml);

      assert.strictEqual(
        result.pdfUrl,
        "https://search.mlp.cz/download/book.pdf",
      );
      assert.strictEqual(
        result.epubUrl,
        "https://search.mlp.cz/download/book.epub",
      );
    });

    test("should handle missing download links", () => {
      const reservationHtml = `
        <html>
          <body>
            <div class="download-section">
              <p>No downloads available</p>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpDownloadLinks(reservationHtml);

      assert.strictEqual(result.pdfUrl, null);
      assert.strictEqual(result.epubUrl, null);
    });

    test("should handle only PDF link", () => {
      const reservationHtml = `
        <html>
          <body>
            <a href="/files/document.pdf" download>PDF only</a>
          </body>
        </html>
      `;

      const result = parseMlpDownloadLinks(reservationHtml);

      assert.strictEqual(
        result.pdfUrl,
        "https://search.mlp.cz/files/document.pdf",
      );
      assert.strictEqual(result.epubUrl, null);
    });

    test("should handle only EPUB link", () => {
      const reservationHtml = `
        <html>
          <body>
            <a href="/files/ebook.epub" download>EPUB only</a>
          </body>
        </html>
      `;

      const result = parseMlpDownloadLinks(reservationHtml);

      assert.strictEqual(result.pdfUrl, null);
      assert.strictEqual(
        result.epubUrl,
        "https://search.mlp.cz/files/ebook.epub",
      );
    });

    test("should handle multiple links of same type (take first)", () => {
      const reservationHtml = `
        <html>
          <body>
            <a href="/files/first.pdf" download>First PDF</a>
            <a href="/files/second.pdf" download>Second PDF</a>
            <a href="/files/first.epub" download>First EPUB</a>
            <a href="/files/second.epub" download>Second EPUB</a>
          </body>
        </html>
      `;

      const result = parseMlpDownloadLinks(reservationHtml);

      assert.strictEqual(
        result.pdfUrl,
        "https://search.mlp.cz/files/first.pdf",
      );
      assert.strictEqual(
        result.epubUrl,
        "https://search.mlp.cz/files/first.epub",
      );
    });

    test("should handle links without download attribute", () => {
      const reservationHtml = `
        <html>
          <body>
            <a href="/files/document.pdf">PDF without download attribute</a>
            <a href="/files/ebook.epub">EPUB without download attribute</a>
          </body>
        </html>
      `;

      const result = parseMlpDownloadLinks(reservationHtml);

      assert.strictEqual(result.pdfUrl, null);
      assert.strictEqual(result.epubUrl, null);
    });

    test("should handle empty HTML", () => {
      const result = parseMlpDownloadLinks("");

      assert.strictEqual(result.pdfUrl, null);
      assert.strictEqual(result.epubUrl, null);
    });

    test("should handle malformed HTML gracefully", () => {
      const malformedHtml = `<html><body><a href="/test.pdf" download><span>Unclosed span</body></html>`;

      const result = parseMlpDownloadLinks(malformedHtml);

      // Should not throw
      assert.ok(typeof result.pdfUrl === "string" || result.pdfUrl === null);
      assert.ok(typeof result.epubUrl === "string" || result.epubUrl === null);
    });
  });

  describe("Integration tests with real fixture", () => {
    test("should extract expected data from real MLP fixture", () => {
      const mlpHtml = loadFixture("mlp-sample.html");

      const result = parseMlpBookDetails(mlpHtml);

      // Test that we get some meaningful data from the real fixture
      console.log("Real fixture extraction result:", result);

      // Basic checks - at least one field should be populated for a real page
      const hasData =
        result.description !== null ||
        result.partTitle !== null ||
        result.subtitle !== null ||
        result.imageUrl !== null;

      assert.ok(
        hasData,
        "Should extract at least some data from real MLP fixture",
      );

      // Check genre data specifically
      if (result.genreId || result.genre) {
        console.log("Genre data from real fixture:", {
          genreId: result.genreId,
          genre: result.genre,
        });
      }
    });

    test("should extract part title from David Copperfield Part I fixture", () => {
      const davidCopperfieldHtml = loadFixture("david-copperfield-part-i.html");

      const result = parseMlpBookDetails(davidCopperfieldHtml);

      console.log("David Copperfield extraction result:", result);

      // Based on the HTML structure we examined, the part title should be "I"
      // (stored in the "Podnázev" field, not "Název části")
      assert.strictEqual(
        result.subtitle,
        "I",
        "Should extract subtitle 'I' from David Copperfield Part I",
      );
      assert.strictEqual(
        result.partTitle,
        null,
        "Part title should be null as it's stored in subtitle field",
      );

      // Test backwards compatibility - partTitle || subtitle should be "I"
      assert.strictEqual(
        result.partTitle || result.subtitle,
        "I",
        "partTitle || subtitle should return 'I' for backwards compatibility",
      );
    });

    test("should extract both subtitle and part name when both are present", () => {
      const htmlWithBothFields = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Podnázev</td>
                    <td>A Complete Novel</td>
                  </tr>
                  <tr>
                    <td class="itemlefttd">Název části</td>
                    <td>Chapter 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithBothFields);

      assert.strictEqual(
        result.subtitle,
        "A Complete Novel",
        "Should extract subtitle from Podnázev field",
      );
      assert.strictEqual(
        result.partTitle,
        "Chapter 1",
        "Should extract part title from Název části field",
      );

      // Test backwards compatibility - should prefer partTitle over subtitle
      assert.strictEqual(
        result.partTitle || result.subtitle,
        "Chapter 1",
        "partTitle || subtitle should prefer partTitle when both are available",
      );
    });

    test("should extract only subtitle when part name is missing", () => {
      const htmlWithOnlySubtitle = `
        <html>
          <body>
            <div class="book-content book-info-table">
              <table>
                <tbody>
                  <tr>
                    <td class="itemlefttd">Podnázev</td>
                    <td>The Complete Guide</td>
                  </tr>
                  <tr>
                    <td class="itemlefttd">Other Field</td>
                    <td>Other Value</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

      const result = parseMlpBookDetails(htmlWithOnlySubtitle);

      assert.strictEqual(
        result.subtitle,
        "The Complete Guide",
        "Should extract subtitle",
      );
      assert.strictEqual(
        result.partTitle,
        null,
        "Part title should be null when not present",
      );

      // Test backwards compatibility - should fall back to subtitle
      assert.strictEqual(
        result.partTitle || result.subtitle,
        "The Complete Guide",
        "partTitle || subtitle should fall back to subtitle when partTitle is null",
      );
    });
  });
});
