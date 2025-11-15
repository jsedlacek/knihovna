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
    description: "Romány, novely a povídky",
    title: "Beletrie - Nejlepší e-knihy zdarma",
    metaDescription:
      "Nejlepší beletristické e-knihy zdarma z Městské knihovny v Praze. Romány, novely a povídky s hodnocením 4,0 a vyšším.",
  },
  poezie: {
    name: "Poezie",
    genreIds: ["B2" as GenreId],
    description: "Básnické sbírky a poezie",
    title: "Poezie - Nejlepší e-knihy zdarma",
    metaDescription:
      "Nejlepší e-knihy poezie zdarma z Městské knihovny v Praze. Básnické sbírky s hodnocením 4,0 a vyšším.",
  },
  divadlo: {
    name: "Divadlo",
    genreIds: ["B1" as GenreId],
    description: "Divadelní hry a dramata",
    title: "Divadlo - Nejlepší e-knihy zdarma",
    metaDescription:
      "Nejlepší e-knihy divadelních her zdarma z Městské knihovny v Praze. Divadelní texty s hodnocením 4,0 a vyšším.",
  },
  deti: {
    name: "Knížky pro děti",
    genreIds: ["A3" as GenreId, "A4" as GenreId],
    description: "Knihy pro děti a mládež",
    title: "Dětské knihy - Nejlepší e-knihy zdarma",
    metaDescription:
      "Nejlepší dětské e-knihy zdarma z Městské knihovny v Praze. Knihy pro děti všech věků s hodnocením 4,0 a vyšším.",
  },
  ostatni: {
    name: "Ostatní",
    genreIds: [] as GenreId[],
    description: "Ostatní žánry a témata",
    title: "Ostatní - Nejlepší e-knihy zdarma",
    metaDescription:
      "Nejlepší ostatní e-knihy zdarma z Městské knihovny v Praze. Různé žánry a témata s hodnocením 4,0 a vyšším.",
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
