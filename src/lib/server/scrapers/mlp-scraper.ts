import { fetchJson } from "#@/lib/server/utils/fetch-utils.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { getBestImageUrl } from "#@/lib/shared/utils/text-utils.ts";
import {
  MLP_API_URL,
  MLP_BASE_URL,
  MLP_KOWEB_URL,
  MLP_PAGE_SIZE,
} from "#@/lib/shared/config/scraper-config.ts";
import type { MlpBookDetails, MlpBookListing } from "#@/lib/shared/types/book-types.ts";
import { createSlug } from "#@/lib/shared/utils/book-url-utils.ts";
import { cleanAuthorName, cleanTitle } from "#@/lib/shared/utils/text-utils.ts";

const log = createLogger("mlp-scraper");

// --- Elasticsearch API response types ---

interface MlpApiNazevMarc {
  name: string;
  name_view_value: string;
  value: string;
}

interface MlpApiOsoba {
  jmeno: string;
  role_kod: string;
  role: string;
  prozahlavi?: string;
}

interface MlpApiOch {
  txoch_och_full: string;
  tema: string;
}

interface MlpApiDigi {
  digi_ptr_soubor: string;
  digi_format: string;
  digi_filesize: string;
}

interface MlpApiHitSource {
  titul_key: number;
  nazev?: string[];
  nazev_marc?: MlpApiNazevMarc[];
  osoba?: MlpApiOsoba[];
  nakladatelstvi?: string[];
  rok?: string[];
  anotace?: string[];
  anotace_dlouha?: string[];
  tag?: string[];
  ke_stazeni?: string[];
  format?: string[];
  och?: MlpApiOch[];
  digi?: MlpApiDigi[];
  has_img_small?: boolean;
  has_img?: boolean;
}

interface MlpApiSearchResponse {
  hits: {
    total: { value: number };
    hits: Array<{ _source: MlpApiHitSource }>;
  };
}

interface MlpApiDetailResponse {
  hits: {
    hits: Array<{ _source: MlpApiHitSource }>;
  };
}

// --- URL construction helpers ---

/**
 * Build a koweb download path from a titul_key.
 * Pads to 10 digits, splits into 5 groups of 2.
 * Example: 4345513 -> "00/04/34/55/13/"
 */
export function buildKowebDownloadPath(key: number): string {
  const padded = key.toString().padStart(10, "0");
  const groups = [];
  for (let i = 0; i < 5; i++) {
    groups.push(padded.substring(2 * i, 2 * (i + 1)));
  }
  return groups.join("/") + "/";
}

/**
 * Build a cover image URL from a titul_key.
 * Pads to 10 digits, first 4 groups of 2 for path, last 2 digits as suffix.
 * Example: 4961244 -> "https://web2.mlp.cz/koweb/00/04/96/12/Small.44.jpg"
 */
export function buildImageUrl(titulKey: number): string {
  const padded = titulKey.toString().padStart(10, "0");
  const groups = [];
  for (let i = 0; i < 4; i++) {
    groups.push(padded.substring(2 * i, 2 * (i + 1)));
  }
  const suffix = padded.substring(8, 10);
  return `${MLP_KOWEB_URL}${groups.join("/")}/Small.${suffix}.jpg`;
}

/**
 * Build a download URL for a specific file format.
 */
export function buildDownloadUrl(titulKey: number, filename: string, format: string): string {
  return `${MLP_KOWEB_URL}${buildKowebDownloadPath(titulKey)}${filename}.${format}`;
}

// --- Data parsing helpers ---

/**
 * Extract title from API hit source.
 */
function extractTitle(source: MlpApiHitSource): string {
  if (source.nazev_marc) {
    const hln = source.nazev_marc.find((m) => m.name === "HLN");
    if (hln?.value) return cleanTitle(hln.value);
  }
  if (source.nazev?.[0]) return cleanTitle(source.nazev[0]);
  return "Title Not Found";
}

/**
 * Extract subtitle from nazev_marc PODN entry.
 */
function extractSubtitle(source: MlpApiHitSource): string | null {
  const podn = source.nazev_marc?.find((m) => m.name === "PODN");
  return podn?.value ? cleanTitle(podn.value) : null;
}

/**
 * Extract part title from nazev_marc CAST entry.
 */
function extractPartTitle(source: MlpApiHitSource): string | null {
  const cast = source.nazev_marc?.find((m) => m.name === "CAST");
  return cast?.value ? cleanTitle(cast.value) : null;
}

/**
 * Extract author name from osoba array.
 * Prefers the entry with prozahlavi="1", then falls back to first author.
 */
function extractAuthor(source: MlpApiHitSource): string {
  if (!source.osoba?.length) return "Unknown Author";

  const authors = source.osoba.filter((o) => o.role_kod === "aut");
  if (authors.length === 0) return cleanAuthorName(source.osoba[0]!.jmeno) || "Unknown Author";

  const primary = authors.find((a) => a.prozahlavi === "1");
  const author = primary ?? authors[0]!;
  return cleanAuthorName(author.jmeno) || "Unknown Author";
}

/**
 * Extract year from rok field.
 */
function extractYear(source: MlpApiHitSource): number | null {
  if (!source.rok?.[0]) return null;
  const year = Number.parseInt(source.rok[0], 10);
  return Number.isNaN(year) ? null : year;
}

/**
 * Parse listing data from an API search hit.
 */
export function parseApiBookListing(source: MlpApiHitSource): MlpBookListing {
  const title = extractTitle(source);
  const slug = createSlug(title);
  return {
    titulKey: source.titul_key,
    title,
    author: extractAuthor(source),
    publisher: source.nakladatelstvi?.[0] || null,
    year: extractYear(source),
    detailUrl: `${MLP_BASE_URL}/katalog/titul/${slug}/${source.titul_key}/`,
  };
}

/**
 * Parse detail data from a full API source (requires source=full).
 */
export function parseApiBookDetails(source: MlpApiHitSource): MlpBookDetails {
  // Genre from OCH
  let genreId: string | null = null;
  let genre: string | null = null;
  if (source.och?.length) {
    genreId = source.och[0]!.txoch_och_full || null;
    genre = source.och[0]!.tema || null;
  }

  // Image URL from titul_key (uses has_img_small/has_img flags)
  let imageUrl: string | null = null;
  if (source.has_img_small || source.has_img) {
    imageUrl = buildImageUrl(source.titul_key);
  }

  // Download URLs from digi
  let pdfUrl: string | null = null;
  let epubUrl: string | null = null;
  if (source.digi?.length) {
    for (const digi of source.digi) {
      const url = buildDownloadUrl(source.titul_key, digi.digi_ptr_soubor, digi.digi_format);
      if (digi.digi_format === "pdf" && !pdfUrl) pdfUrl = url;
      if (digi.digi_format === "epub" && !epubUrl) epubUrl = url;
    }
  }

  // Description: prefer long annotation, fall back to short
  const description = source.anotace_dlouha?.[0] || source.anotace?.[0] || null;

  return {
    subtitle: extractSubtitle(source),
    partTitle: extractPartTitle(source),
    imageUrl,
    description,
    pdfUrl,
    epubUrl,
    genreId,
    genre,
  };
}

// --- Main scraping functions ---

/**
 * Fetch full book details from the MLP detail API.
 */
export async function fetchMlpBookDetails(titulKey: number): Promise<MlpBookDetails> {
  const url = `${MLP_API_URL}titul?id=${titulKey}&source=full`;
  const data = await fetchJson<MlpApiDetailResponse>(url);

  if (!data.hits.hits.length) {
    log.warn("No detail data found", { titulKey });
    return {
      subtitle: null,
      partTitle: null,
      imageUrl: null,
      description: null,
      pdfUrl: null,
      epubUrl: null,
      genreId: null,
      genre: null,
    };
  }

  const details = parseApiBookDetails(data.hits.hits[0]!._source);
  details.imageUrl = await getBestImageUrl(details.imageUrl);
  return details;
}

/**
 * Scrape all free e-books from MLP using the search API.
 * Returns listing data for all books. Detail data (downloads, genre) must be
 * fetched separately via fetchMlpBookDetails().
 */
export async function scrapeMlpListingPages(): Promise<MlpBookListing[]> {
  log.info("Starting MLP API scraping");
  const books: MlpBookListing[] = [];
  let from = 0;

  while (true) {
    const url = `${MLP_API_URL}titul/search?filter%5Bformat%5D%5Beq%5D=e-kniha&size=${MLP_PAGE_SIZE}&from=${from}`;
    log.info("Fetching MLP API page", { from });

    const data = await fetchJson<MlpApiSearchResponse>(url);
    const hits = data.hits.hits;

    if (hits.length === 0) break;

    for (const hit of hits) {
      const source = hit._source;
      // Only include downloadable e-books
      if (source.ke_stazeni?.[0] !== "T") continue;

      const listing = parseApiBookListing(source);
      books.push(listing);
    }

    from += MLP_PAGE_SIZE;

    if (from >= data.hits.total.value) break;
  }

  log.info("Found downloadable e-books from MLP API", { count: books.length });
  return books;
}
