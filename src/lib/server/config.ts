import { join } from "node:path";

/**
 * @file Node.js-specific configuration.
 * This file contains configuration that is only safe to use in a Node.js environment
 * and should not be imported into client-side browser code.
 */

// --- File Configuration ---
export const OUTPUT_FILE = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "data",
  "books.json",
);
