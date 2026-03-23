// --- URL Configuration ---
export const MLP_BASE_URL = "https://www.mlp.cz";
export const MLP_API_URL = "https://www.mlp.cz/katalog/api/";
export const MLP_KOWEB_URL = "https://web2.mlp.cz/koweb/";
export const GOODREADS_BASE_URL = "https://www.goodreads.com";

// --- File Configuration ---

// --- Scraping Configuration ---
export const MLP_PAGE_SIZE = 100; // Results per API page
export const CONCURRENCY = 20; // Number of concurrent requests

// --- HTTP Configuration ---
export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

export const ACCEPT_LANGUAGE = "en-US,en;q=0.5";

// --- Goodreads Configuration ---

// --- Validation Configuration ---
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2099;
export const MIN_RATING = 0;
export const MAX_RATING = 5;
