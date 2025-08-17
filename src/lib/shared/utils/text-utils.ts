import type { PublisherInfo } from "#@/lib/shared/types/book-types.ts";
import { MIN_YEAR, MAX_YEAR } from "#@/lib/shared/config/scraper-config.ts";

/**
 * Cleans title text by removing extra whitespace, newlines, and tabs.
 */
export function cleanTitle(title: string | null | undefined): string {
  if (!title) {
    return "";
  }
  // Remove extra whitespace, newlines, and tabs
  return title.replace(/\s+/g, " ").trim();
}

/**
 * Cleans and normalizes author names.
 */
export function cleanAuthorName(author: string | null): string | null {
  if (!author?.trim()) return null;
  return author
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/^[,\s]+|[,\s]+$/g, "") // Remove leading/trailing commas and spaces
    .replace(/\s*,\s*/g, ", "); // Normalize comma spacing
}

/**
 * Parses publisher information to extract publisher name and year.
 */
export function parsePublisherInfo(
  publisherInfo: string | null,
): PublisherInfo {
  if (!publisherInfo?.trim()) {
    return { publisher: null, year: null };
  }
  const trimmedInfo = publisherInfo.trim();
  const yearMatch = trimmedInfo.match(/^(.+?)\s+(\d{4})$/);
  if (yearMatch) {
    const publisher = yearMatch[1]!.trim();
    const year = parseInt(yearMatch[2]!, 10);
    if (year >= MIN_YEAR && year <= MAX_YEAR) {
      return { publisher, year };
    }
  }
  return { publisher: trimmedInfo, year: null };
}

/**
 * Checks if a URL exists by making a HEAD request.
 */
export async function urlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Extracts high resolution image URL from low resolution URL.
 * Does not validate if the URL exists - that should be done at a higher level.
 */
export function getHighResImageUrl(lowResUrl: string): string | null {
  try {
    // Handle the format: https://web2.mlp.cz/koweb/00/05/07/22/Small.17.jpg
    // Convert to: https://web2.mlp.cz/koweb/00/05/07/22/17.jpg
    const smallMatch = lowResUrl.match(
      /^(https:\/\/web2\.mlp\.cz\/koweb\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/)Small\.(\d+)\.jpg$/,
    );

    if (smallMatch) {
      const [, basePath, imageNumber] = smallMatch;
      return `${basePath}${imageNumber}.jpg`;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Gets the best available image URL, preferring high-res if it exists.
 * Validates that the high-res URL exists before returning it.
 */
export async function getBestImageUrl(
  originalUrl: string | null,
): Promise<string | null> {
  if (!originalUrl) return null;

  const highResUrl = getHighResImageUrl(originalUrl);
  if (highResUrl && (await urlExists(highResUrl))) {
    return highResUrl;
  }

  return originalUrl;
}

/**
 * Cleans text for use in a search query by removing special characters and normalizing whitespace.
 * @param text The text to clean.
 * @returns A cleaned string suitable for a search query.
 */
export function cleanTextForSearch(text: string): string {
  // Removes characters that are not letters, numbers, or whitespace, then collapses whitespace.
  return text
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cleans search terms for Goodreads queries.
 */
export function cleanSearchTerm(term: string): string {
  return term
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // Keep letters, numbers, and spaces
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * Extracts author surname for better search matching.
 */
export function getAuthorForSearch(author: string): string {
  const cleanedAuthor = cleanSearchTerm(author);
  // Use surname (first part before comma) for better matching if available
  return cleanedAuthor.split(",")[0] || cleanedAuthor;
}

/**
 * Formats numbers using Czech locale formatting.
 * Uses space as thousands separator (e.g., 1 234 567).
 */
export function formatNumberCzech(number: number): string {
  return new Intl.NumberFormat("cs-CZ").format(number);
}

/**
 * Formats author name from "Last, First" format to "First Last" format.
 * If the name doesn't contain a comma, returns it as-is.
 * @param author The author name to format.
 * @returns The formatted author name.
 */
export function formatAuthorName(author: string): string {
  if (!author?.trim()) return author;

  const trimmed = author.trim();

  // Check if the name contains a comma (indicating "Last, First" format)
  if (trimmed.includes(",")) {
    const parts = trimmed.split(",").map((part) => part.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      // Return "First Last" format
      return `${parts[1]} ${parts[0]}`;
    }
  }

  // Return as-is if no comma or invalid format
  return trimmed;
}

/**
 * Calculates the Jaro-Winkler similarity between two strings.
 * Returns a value between 0 (no similarity) and 1 (exact match).
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns The similarity score.
 */
export function calculateSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0.0;

  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  const matches1 = new Array(len1).fill(false);
  const matches2 = new Array(len2).fill(false);
  let matches = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, len2);
    for (let j = start; j < end; j++) {
      if (!matches2[j] && s1[i] === s2[j]) {
        matches1[i] = true;
        matches2[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0.0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (matches1[i]) {
      while (!matches2[k]) k++;
      if (s1[i] !== s2[k]) transpositions++;
      k++;
    }
  }

  const jaro =
    (matches / len1 +
      matches / len2 +
      (matches - transpositions / 2) / matches) /
    3;

  // Winkler bonus for common prefix
  let prefix = 0;
  for (let i = 0; i < Math.min(len1, len2, 4); i++) {
    if (s1[i] === s2[i]) {
      prefix++;
    } else {
      break;
    }
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}
