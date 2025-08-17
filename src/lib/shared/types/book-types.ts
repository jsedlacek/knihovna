// Data scraped from an MLP listing page
export interface MlpBookListing {
  title: string;
  author: string;
  publisher: string | null;
  year: number | null;
  detailUrl: string;
}

// Data scraped from an MLP book detail page
export interface MlpBookDetails {
  subtitle: string | null;
  partTitle: string | null;
  imageUrl: string | null;
  description: string | null;
  pdfUrl: string | null;
  epubUrl: string | null;
}

// Data scraped from Goodreads
export interface GoodreadsData {
  rating: number | null;
  ratingsCount: number | null;
  url: string | null;
  genres: string[];
}

// The canonical Book object, combining all data sources.
// This is the format used in the final books.json file.
export interface Book extends MlpBookListing, MlpBookDetails, GoodreadsData {
  mlpScrapedAt: string | null;
  goodreadsScrapedAt: string | null;
}

// A complete book object from the MLP source
export type MlpBook = MlpBookListing & MlpBookDetails;

// Legacy interfaces for backwards compatibility during transition
export interface PublisherInfo {
  publisher: string | null;
  year: number | null;
}

export interface DownloadLinks {
  pdfUrl: string | null;
  epubUrl: string | null;
  subtitle: string | null;
  partTitle: string | null;
  imageUrl: string | null;
  description: string | null;
}

export interface ScrapingOptions {
  forceMlp: boolean;
  forceGoodreads: boolean;
  mlpOnly: boolean;
  goodreadsOnly: boolean;
}
