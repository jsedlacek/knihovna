export interface MlpBook {
  title: string;
  partTitle: string | null;
  author: string;
  publisher: string | null;
  year: number | null;
  detailUrl: string;
  pdfUrl: string | null;
  epubUrl: string | null;
  imageUrl: string | null;
  description: string | null;
}

export interface GoodreadsData {
  rating: number | null;
  ratingsCount: number | null;
  url: string | null;
  genres: string[];
}

export interface CombinedBook extends MlpBook, GoodreadsData {}

// Main Book interface used throughout the application
export interface Book {
  title: string;
  partTitle: string | null;
  author: string;
  publisher: string;
  year: number;
  detailUrl: string;
  pdfUrl: string;
  epubUrl: string;
  imageUrl: string;
  description: string;
  rating: number | null;
  ratingsCount: number | null;
  url: string | null;
  genres: string[] | null | undefined;
}

export interface PublisherInfo {
  publisher: string | null;
  year: number | null;
}

export interface DownloadLinks {
  pdfUrl: string | null;
  epubUrl: string | null;
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
