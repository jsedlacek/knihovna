import assert from "node:assert";
import { describe, test } from "node:test";
import { getHighResImageUrl } from "#@/lib/shared/utils/text-utils.ts";
import { loadFixture } from "#@/test/utils/test-utils.ts";
import { buildAuthorImageUrl, parseAuthorApiResponse } from "./author-scraper.ts";

describe("Author Scraper", () => {
  describe("buildAuthorImageUrl", () => {
    test("should build correct URL for Karel Čapek (key 1125061)", () => {
      const url = buildAuthorImageUrl(1125061);
      assert.strictEqual(url, "https://web2.mlp.cz/koweb/00/01/12/50/_OSOBY.Small.61.jpg");
    });

    test("should pad short keys correctly", () => {
      const url = buildAuthorImageUrl(123);
      assert.strictEqual(url, "https://web2.mlp.cz/koweb/00/00/00/01/_OSOBY.Small.23.jpg");
    });

    test("should handle 10-digit key without padding", () => {
      const url = buildAuthorImageUrl(1234567890);
      assert.strictEqual(url, "https://web2.mlp.cz/koweb/12/34/56/78/_OSOBY.Small.90.jpg");
    });
  });

  describe("parseAuthorApiResponse", () => {
    test("should parse full author data from real fixture", () => {
      const fixtureJson = loadFixture("mlp-author-capek.json");
      const data = JSON.parse(fixtureJson);
      const source = data.hits.hits[0]._source;

      const result = parseAuthorApiResponse(source);

      assert.strictEqual(result.name, "Čapek, Karel");
      assert.ok(result.description !== null, "Description should be present");
      assert.ok(result.description!.includes("1890"), "Description should mention birth year");
      assert.strictEqual(result.born, "1890-1938");
      assert.ok(result.imageUrl !== null, "Image URL should be present when obr is true");
      assert.ok(
        result.imageUrl!.includes("_OSOBY.Small."),
        "Image URL should contain _OSOBY.Small. prefix",
      );
    });

    test("should handle author without bio", () => {
      const result = parseAuthorApiResponse({
        key: 999999,
        jmeno: "Neznámý, Autor",
      });

      assert.strictEqual(result.name, "Neznámý, Autor");
      assert.strictEqual(result.description, null);
      assert.strictEqual(result.imageUrl, null);
      assert.strictEqual(result.born, null);
    });

    test("should handle author without image", () => {
      const result = parseAuthorApiResponse({
        key: 999999,
        jmeno: "Test, Author",
        pozn: "Some bio text",
        narozen: "1900-2000",
        obr: false,
        obr_small: false,
      });

      assert.strictEqual(result.name, "Test, Author");
      assert.strictEqual(result.description, "Some bio text");
      assert.strictEqual(result.born, "1900-2000");
      assert.strictEqual(result.imageUrl, null);
    });

    test("should build image URL when obr_small is true", () => {
      const result = parseAuthorApiResponse({
        key: 1125061,
        jmeno: "Čapek, Karel",
        obr_small: true,
      });

      assert.strictEqual(
        result.imageUrl,
        "https://web2.mlp.cz/koweb/00/01/12/50/_OSOBY.Small.61.jpg",
      );
    });

    test("should build image URL when only obr is true", () => {
      const result = parseAuthorApiResponse({
        key: 1125061,
        jmeno: "Čapek, Karel",
        obr: true,
        obr_small: false,
      });

      assert.ok(result.imageUrl !== null);
      assert.ok(result.imageUrl!.includes("_OSOBY.Small."));
    });

    test("should return null dimensions (set later during fetch)", () => {
      const result = parseAuthorApiResponse({
        key: 1125061,
        jmeno: "Test",
        obr_small: true,
      });

      assert.strictEqual(result.imageWidth, null);
      assert.strictEqual(result.imageHeight, null);
    });
  });

  describe("getHighResImageUrl with author images", () => {
    test("should convert _OSOBY.Small to _OSOBY high-res", () => {
      const url = getHighResImageUrl("https://web2.mlp.cz/koweb/00/01/12/50/_OSOBY.Small.61.jpg");
      assert.strictEqual(url, "https://web2.mlp.cz/koweb/00/01/12/50/_OSOBY.61.jpg");
    });

    test("should still work for regular book covers", () => {
      const url = getHighResImageUrl("https://web2.mlp.cz/koweb/00/05/07/22/Small.17.jpg");
      assert.strictEqual(url, "https://web2.mlp.cz/koweb/00/05/07/22/17.jpg");
    });

    test("should return null for unrecognized URL", () => {
      const url = getHighResImageUrl("https://example.com/image.jpg");
      assert.strictEqual(url, null);
    });
  });
});
