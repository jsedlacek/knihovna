import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { formatDateCzech, formatDateTimeCzech } from "./date-utils.ts";

describe("Date Utils", () => {
  describe("formatDateCzech", () => {
    test("formats ISO date string to Czech format", () => {
      const isoDate = "2024-12-15T10:30:00.000Z";
      const result = formatDateCzech(isoDate);
      assert.equal(result, "15. prosince 2024");
    });

    test("handles different months correctly", () => {
      const testCases = [
        { input: "2024-01-01T12:00:00.000Z", expected: "1. ledna 2024" },
        { input: "2024-02-29T12:00:00.000Z", expected: "29. února 2024" },
        { input: "2024-03-15T12:00:00.000Z", expected: "15. března 2024" },
        { input: "2024-04-10T12:00:00.000Z", expected: "10. dubna 2024" },
        { input: "2024-05-25T12:00:00.000Z", expected: "25. května 2024" },
        { input: "2024-06-30T12:00:00.000Z", expected: "30. června 2024" },
        { input: "2024-07-04T12:00:00.000Z", expected: "4. července 2024" },
        { input: "2024-08-20T12:00:00.000Z", expected: "20. srpna 2024" },
        { input: "2024-09-12T12:00:00.000Z", expected: "12. září 2024" },
        { input: "2024-10-31T12:00:00.000Z", expected: "31. října 2024" },
        { input: "2024-11-11T12:00:00.000Z", expected: "11. listopadu 2024" },
        { input: "2024-12-25T12:00:00.000Z", expected: "25. prosince 2024" },
      ];

      for (const testCase of testCases) {
        const result = formatDateCzech(testCase.input);
        assert.equal(result, testCase.expected, `Failed for ${testCase.input}`);
      }
    });

    test("handles different years correctly", () => {
      const result2023 = formatDateCzech("2023-06-15T12:00:00.000Z");
      const result2025 = formatDateCzech("2025-06-15T12:00:00.000Z");

      assert.equal(result2023, "15. června 2023");
      assert.equal(result2025, "15. června 2025");
    });

    test("is consistent across multiple calls", () => {
      const isoDate = "2024-12-15T10:30:00.000Z";
      const result1 = formatDateCzech(isoDate);
      const result2 = formatDateCzech(isoDate);
      const result3 = formatDateCzech(isoDate);

      assert.equal(result1, result2);
      assert.equal(result2, result3);
      assert.equal(result1, "15. prosince 2024");
    });
  });

  describe("formatDateTimeCzech", () => {
    test("formats ISO date string to Czech date and time format", () => {
      const isoDate = "2024-12-15T10:30:00.000Z";
      const result = formatDateTimeCzech(isoDate);
      // Note: This will be in UTC time, so we need to account for timezone
      // The exact time will depend on the system timezone, but the format should be consistent
      assert.match(result, /^\d{1,2}\. \w+ \d{4}, \d{2}:\d{2}$/);
    });

    test("handles different times correctly", () => {
      const isoDate = "2024-06-15T14:25:00.000Z";
      const result = formatDateTimeCzech(isoDate);
      assert.match(result, /^\d{1,2}\. června \d{4}, \d{2}:\d{2}$/);
    });

    test("pads hours and minutes with leading zeros", () => {
      const isoDate = "2024-01-05T09:05:00.000Z";
      const result = formatDateTimeCzech(isoDate);
      // Should contain properly padded time
      assert.match(result, /, \d{2}:\d{2}$/);
    });

    test("is consistent across multiple calls", () => {
      const isoDate = "2024-12-15T10:30:00.000Z";
      const result1 = formatDateTimeCzech(isoDate);
      const result2 = formatDateTimeCzech(isoDate);
      const result3 = formatDateTimeCzech(isoDate);

      assert.equal(result1, result2);
      assert.equal(result2, result3);
    });
  });

  describe("Consistency between formatDateCzech and formatDateTimeCzech", () => {
    test("date portion should be identical between both functions", () => {
      const isoDate = "2024-12-15T10:30:00.000Z";
      const dateOnly = formatDateCzech(isoDate);
      const dateTime = formatDateTimeCzech(isoDate);

      // Extract the date part from the date-time string
      const datePortion = dateTime.split(",")[0];
      assert.equal(dateOnly, datePortion);
    });
  });
});
