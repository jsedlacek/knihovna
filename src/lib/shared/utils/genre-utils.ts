import type { Book } from "#@/lib/shared/types/book-types.ts";

// Genre mapping with Czech names
export const GENRE_MAPPING = {
  A1: "Beletrie",
  B2: "Poezie",
  B1: "Divadlo",
  A3: "Knížky pro děti",
  A4: "Knížky pro děti",
} as const;

type GenreId = keyof typeof GENRE_MAPPING;

// Genre group definitions
export const GENRE_GROUPS = {
  beletrie: {
    name: "Beletrie",
    genreIds: ["A1" as GenreId],
    description: "Současná próza, romány a novely",
  },
  poezie: {
    name: "Poezie",
    genreIds: ["B2" as GenreId],
    description: "Sbírky básní a veršů",
  },
  divadlo: {
    name: "Divadlo",
    genreIds: ["B1" as GenreId],
    description: "Divadelní hry a dramata",
  },
  deti: {
    name: "Knížky pro děti",
    genreIds: ["A3" as GenreId, "A4" as GenreId],
    description: "Literatura pro mladé čtenáře",
  },
  ostatni: {
    name: "Ostatní",
    genreIds: [] as GenreId[],
    description: "Další žánry a kategorie",
  },
} as const;

export type GenreGroup = keyof typeof GENRE_GROUPS;

export type BooksByGenre = {
  [K in GenreGroup]: Book[];
};

export function groupBooksByGenre(books: Book[]): BooksByGenre {
  const groups: BooksByGenre = {
    beletrie: [],
    poezie: [],
    divadlo: [],
    deti: [],
    ostatni: [],
  };

  for (const book of books) {
    if (!book.genreId) {
      groups.ostatni.push(book);
      continue;
    }

    // Check which group this book belongs to
    let assigned = false;
    for (const [groupKey, groupConfig] of Object.entries(GENRE_GROUPS)) {
      if (groupKey === "ostatni") continue;

      if (groupConfig.genreIds.includes(book.genreId as GenreId)) {
        groups[groupKey as keyof typeof groups].push(book);
        assigned = true;
        break;
      }
    }

    // If not assigned to any specific group, put in ostatni
    if (!assigned) {
      groups.ostatni.push(book);
    }
  }

  return groups;
}

/**
 * Get the Czech genre name for a genre ID
 */
export function getGenreName(genreId: string | null): string {
  if (!genreId) return "Neznámý žánr";
  return GENRE_MAPPING[genreId as keyof typeof GENRE_MAPPING] || "Ostatní";
}

/**
 * Get books for a specific genre group
 */
export function getBooksForGenreGroup(
  books: Book[],
  groupKey: keyof typeof GENRE_GROUPS,
): Book[] {
  const groupConfig = GENRE_GROUPS[groupKey];

  if (groupKey === "ostatni") {
    // For "ostatni", include books that don't match any other category
    return books.filter((book) => {
      if (!book.genreId) return true;

      // Check if this book belongs to any specific group
      for (const [key, config] of Object.entries(GENRE_GROUPS)) {
        if (key === "ostatni") continue;
        if (config.genreIds.includes(book.genreId as GenreId)) {
          return false;
        }
      }
      return true;
    });
  }

  return books.filter(
    (book) =>
      book.genreId && groupConfig.genreIds.includes(book.genreId as GenreId),
  );
}
