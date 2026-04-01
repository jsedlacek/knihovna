import { join } from "node:path";

/**
 * @file Node.js-specific configuration.
 * This file contains configuration that is only safe to use in a Node.js environment
 * and should not be imported into client-side browser code.
 */

// --- File Configuration ---
export const RAW_OUTPUT_FILE = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "data",
  "books-raw.json",
);

export const OUTPUT_FILE = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "public",
  "data",
  "books.json",
);

export const RAW_AUTHORS_FILE = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "data",
  "authors-raw.json",
);

export const AUTHORS_OUTPUT_FILE = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "public",
  "data",
  "authors.json",
);
