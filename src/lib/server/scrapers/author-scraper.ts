import { fetchJson } from "#@/lib/server/utils/fetch-utils.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { MLP_API_URL, MLP_KOWEB_URL } from "#@/lib/shared/config/scraper-config.ts";
import { getBestImageUrl, getImageDimensions } from "#@/lib/shared/utils/text-utils.ts";

const log = createLogger("author-scraper");

// --- MLP osoba API response types ---

interface MlpOsobaSource {
  key: number;
  jmeno: string;
  pozn?: string;
  narozen?: string;
  obr?: boolean;
  obr_small?: boolean;
}

interface MlpOsobaApiResponse {
  hits: {
    hits: Array<{ _source: MlpOsobaSource }>;
  };
}

// --- Result type ---

export interface AuthorScrapingResult {
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  born: string | null;
}

// --- Image URL construction ---

/**
 * Build an author portrait URL from an author key.
 * Same padding as book covers but with `_OSOBY.Small.` prefix.
 * Example: 1125061 -> "https://web2.mlp.cz/koweb/00/01/12/50/_OSOBY.Small.61.jpg"
 */
export function buildAuthorImageUrl(authorKey: number): string {
  const padded = authorKey.toString().padStart(10, "0");
  const groups = [];
  for (let i = 0; i < 4; i++) {
    groups.push(padded.substring(2 * i, 2 * (i + 1)));
  }
  const suffix = padded.substring(8, 10);
  return `${MLP_KOWEB_URL}${groups.join("/")}/_OSOBY.Small.${suffix}.jpg`;
}

// --- API response parsing ---

/**
 * Parse author data from MLP osoba API response source.
 */
export function parseAuthorApiResponse(source: MlpOsobaSource): AuthorScrapingResult {
  let imageUrl: string | null = null;
  if (source.obr_small || source.obr) {
    imageUrl = buildAuthorImageUrl(source.key);
  }

  return {
    name: source.jmeno,
    description: source.pozn || null,
    imageUrl,
    imageWidth: null,
    imageHeight: null,
    born: source.narozen || null,
  };
}

// --- Main scraping function ---

/**
 * Fetch author details from the MLP osoba API.
 */
export async function fetchMlpAuthorDetails(authorKey: number): Promise<AuthorScrapingResult> {
  const url = `${MLP_API_URL}osoba?id=${authorKey}`;
  const data = await fetchJson<MlpOsobaApiResponse>(url);

  if (!data.hits.hits.length) {
    log.warn("No author data found", { authorKey });
    return {
      name: "",
      description: null,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
      born: null,
    };
  }

  const result = parseAuthorApiResponse(data.hits.hits[0]!._source);

  // Try high-res image, same approach as book covers
  result.imageUrl = await getBestImageUrl(result.imageUrl);
  const dimensions = await getImageDimensions(result.imageUrl);
  if (dimensions) {
    result.imageWidth = dimensions.width;
    result.imageHeight = dimensions.height;
  }

  return result;
}
