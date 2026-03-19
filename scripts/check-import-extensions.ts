/**
 * Checks that all relative imports include file extensions (required for ESM).
 * Exits with code 1 if any violations are found.
 *
 * Ideally this would be handled by oxlint's import/extensions rule, but its
 * "always" mode is broken since v1.37.0 (https://github.com/oxc-project/oxc/issues/17693).
 * Replace this script with the oxlint rule once that's fixed.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC_DIR = join(import.meta.dirname!, "..", "src");
const EXTENSIONS = [".ts", ".tsx"];
const IGNORE_PATTERNS = [/routeTree\.gen\.ts$/];
const IMPORT_RE =
  /(?:import|export)\s+(?:type\s+)?(?:(?:\{[^}]*\}|[\w*]+)(?:\s*,\s*(?:\{[^}]*\}|[\w*]+))*\s+from\s+)?["'](\.[^"']+)["']/g;

function collectFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue;
      files.push(...collectFiles(full));
    } else if (EXTENSIONS.some((ext) => full.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

let violations = 0;

for (const file of collectFiles(SRC_DIR)) {
  if (IGNORE_PATTERNS.some((p) => p.test(file))) continue;
  const content = readFileSync(file, "utf-8");
  let match: RegExpExecArray | null;
  IMPORT_RE.lastIndex = 0;
  while ((match = IMPORT_RE.exec(content)) !== null) {
    const specifier = match[1];
    // Skip if already has a file extension
    if (/\.\w+$/.test(specifier) && !specifier.endsWith(".")) continue;
    const line = content.slice(0, match.index).split("\n").length;
    const rel = relative(process.cwd(), file);
    console.error(`${rel}:${line} - missing extension: "${specifier}"`);
    violations++;
  }
}

if (violations > 0) {
  console.error(`\nFound ${violations} import(s) missing file extensions.`);
  process.exit(1);
} else {
  console.log("All relative imports have file extensions.");
}
