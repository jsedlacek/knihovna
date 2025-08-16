// --- URL Configuration ---
export const MLP_START_URL =
  "https://search.mlp.cz/cz/davka/e-knihy_volne_ke_stazeni/?action=c_s_ol&espQCId=e-knihy_volne_ke_stazeni&sortBy1=docdatetime&sortOrder1=desc&numHits=100";

export const MLP_BASE_URL = "https://search.mlp.cz";
export const GOODREADS_BASE_URL = "https://www.goodreads.com";

// --- File Configuration ---

// --- Scraping Configuration ---
export const MAX_PAGES = Infinity;
export const CONCURRENCY = 20; // Number of concurrent requests

// --- Retry Configuration ---
export const RETRY_COUNT = 10; // Number of retry attempts
export const RETRY_DELAY = 1000; // Initial delay in milliseconds
export const RETRY_FACTOR = 2; // Exponential backoff multiplier
export const RETRY_MAX_DELAY = 30000; // Maximum delay in milliseconds

// --- HTTP Configuration ---
export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

export const ACCEPT_LANGUAGE = "en-US,en;q=0.5";

// --- Goodreads Configuration ---
export const MAX_GENRES = 10;
export const NON_GENRE_TERMS = [
  "to-read",
  "currently-reading",
  "read",
  "favorites",
  "owned",
  "library",
  "kindle",
  "ebook",
  "audiobook",
  "...more",
];

export const KNOWN_GENRES = [
  "Fantasy",
  "Fiction",
  "Young Adult",
  "Romance",
  "Mystery",
  "Thriller",
  "Science Fiction",
  "Historical Fiction",
  "Contemporary",
  "Horror",
  "Adventure",
  "Magic",
  "Dystopian",
  "Paranormal",
  "Urban Fantasy",
  "Crime",
  "Biography",
  "Memoir",
  "Self Help",
  "Business",
  "History",
  "Philosophy",
  "Psychology",
  "Religion",
  "Science",
  "Politics",
  "Travel",
  "Health",
  "Cooking",
  "Art",
  "Music",
  "Poetry",
  "Drama",
];

// --- Validation Configuration ---
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2099;
export const MIN_RATING = 0;
export const MAX_RATING = 5;
