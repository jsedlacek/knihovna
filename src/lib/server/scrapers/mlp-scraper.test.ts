import assert from "node:assert";
import { afterEach, describe, mock, test } from "node:test";
import { fetchMlpSearchPage } from "./mlp-scraper.ts";

afterEach(() => {
  mock.restoreAll();
});

describe("MLP Scraper", () => {
  describe("fetchMlpSearchPage", () => {
    test("retries transient API failures", async () => {
      let calls = 0;
      mock.method(globalThis, "fetch", async () => {
        calls++;
        if (calls === 1) {
          return new Response("Temporary failure", { status: 500 });
        }

        return Response.json({
          hits: {
            total: { value: 0 },
            hits: [],
          },
        });
      });

      const result = await fetchMlpSearchPage("https://example.com/mlp-search", {
        retries: 1,
        minTimeout: 0,
      });

      assert.strictEqual(calls, 2);
      assert.deepStrictEqual(result.hits.hits, []);
    });
  });
});
