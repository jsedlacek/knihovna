import type { Book } from "#@/lib/shared/types/book-types.ts";

const SCRAPED_AT = "2024-01-15T10:30:00Z";

/** A typical beletrie book with all fields populated. */
export const sampleBook: Book = {
  titulKey: 1001,
  title: "Válka s mloky",
  author: "Karel Čapek",
  publisher: "Československý spisovatel",
  year: 1936,
  detailUrl: "https://www.mlp.cz/katalog/titul/valka-s-mloky/1001/",
  subtitle: null,
  partTitle: null,
  imageUrl: "https://covers.openlibrary.org/b/id/8225261-M.jpg",
  imageWidth: 310,
  imageHeight: 475,
  description:
    "Satirický román o konfliktu mezi lidstvem a inteligentními mloky. Čapkovo dílo je varováním před technologickým pokrokem bez etických zásad.",
  pdfUrl: "https://example.com/valka-s-mloky.pdf",
  epubUrl: "https://example.com/valka-s-mloky.epub",
  genreId: "A1",
  genre: "beletrie",
  rating: 4.5,
  ratingsCount: 987,
  url: "https://goodreads.com/book/valka-s-mloky",
  mlpScrapedAt: SCRAPED_AT,
  goodreadsScrapedAt: SCRAPED_AT,
};

/** A diverse set of sample books across genres. */
export const sampleBooks: Book[] = [
  {
    titulKey: 1001,
    title: "Krakatit",
    author: "Karel Čapek",
    publisher: "Československý spisovatel",
    year: 1922,
    detailUrl: "https://example.com/krakatit",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/240726-M.jpg",
    imageWidth: 340,
    imageHeight: 400,
    description:
      "Román o vynálezci výbušniny, která může zničit svět. Příběh sleduje mladého chemika, který objeví tajemnou látku schopnou obrovské destrukce.",
    pdfUrl: "https://example.com/krakatit.pdf",
    epubUrl: "https://example.com/krakatit.epub",
    genreId: "A1",
    genre: "beletrie",
    rating: 4.6,
    ratingsCount: 1234,
    url: "https://goodreads.com/book/krakatit",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1002,
    title: "Válka s mloky",
    author: "Karel Čapek",
    publisher: "Československý spisovatel",
    year: 1936,
    detailUrl: "https://example.com/valka-s-mloky",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/8225261-M.jpg",
    imageWidth: 310,
    imageHeight: 475,
    description:
      "Satirický román o konfliktu mezi lidstvem a inteligentními mloky. Čapkovo dílo je varováním před technologickým pokrokem bez etických zásad.",
    pdfUrl: null,
    epubUrl: "https://example.com/valka-s-mloky.epub",
    genreId: "A1",
    genre: "beletrie",
    rating: 4.5,
    ratingsCount: 987,
    url: "https://goodreads.com/book/valka-s-mloky",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1003,
    title: "Babička",
    author: "Božena Němcová",
    publisher: null,
    year: 1855,
    detailUrl: "https://example.com/babicka",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/123456-M.jpg",
    imageWidth: 260,
    imageHeight: 400,
    description:
      "Klasický český román o životě na venkově v 19. století. Příběh zachycuje idylický svět moravské vesnice očima dítěte.",
    pdfUrl: "https://example.com/babicka.pdf",
    epubUrl: "https://example.com/babicka.epub",
    genreId: "A1",
    genre: "beletrie",
    rating: 4.3,
    ratingsCount: 2100,
    url: "https://goodreads.com/book/babicka",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1004,
    title: "Osudy dobrého vojáka Švejka",
    author: "Jaroslav Hašek",
    publisher: "Adolf Synek",
    year: 1921,
    detailUrl: "https://example.com/svejk",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/456789-M.jpg",
    imageWidth: 320,
    imageHeight: 480,
    description:
      "Satirický román o prostém vojákovi během první světové války. Dílo plné humoru a kritiky vojenského systému.",
    pdfUrl: "https://example.com/svejk.pdf",
    epubUrl: "https://example.com/svejk.epub",
    genreId: "A1",
    genre: "beletrie",
    rating: 4.5,
    ratingsCount: 3210,
    url: "https://goodreads.com/book/svejk",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1005,
    title: "Malý princ",
    author: "Antoine de Saint-Exupéry",
    publisher: "Gallimard",
    year: 1943,
    detailUrl: "https://example.com/maly-princ",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/789012-M.jpg",
    imageWidth: 290,
    imageHeight: 435,
    description:
      "Filozofická pohádka o malém princi, který cestuje mezi planetami a hledá smysl života a přátelství.",
    pdfUrl: "https://example.com/maly-princ.pdf",
    epubUrl: "https://example.com/maly-princ.epub",
    genreId: "L1",
    genre: "deti",
    rating: 4.7,
    ratingsCount: 5432,
    url: "https://goodreads.com/book/maly-princ",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1006,
    title: "Kytice",
    author: "Karel Jaromír Erben",
    publisher: null,
    year: 1853,
    detailUrl: "https://example.com/kytice",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/654321-M.jpg",
    imageWidth: 300,
    imageHeight: 460,
    description:
      "Sbírka balad inspirovaných lidovou slovesností. Erbenovy básně zachycují tajemný svět českých pověstí a legend.",
    pdfUrl: null,
    epubUrl: "https://example.com/kytice.epub",
    genreId: "B1",
    genre: "poezie",
    rating: 4.2,
    ratingsCount: 1543,
    url: "https://goodreads.com/book/kytice",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1007,
    title: "Máj",
    author: "Karel Hynek Mácha",
    publisher: null,
    year: 1836,
    detailUrl: "https://example.com/maj",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/345678-M.jpg",
    imageWidth: 270,
    imageHeight: 410,
    description:
      "Romantická básnická povídka o lásce, zradě a pomstě. Jedno z nejvýznamnějších děl české literatury.",
    pdfUrl: "https://example.com/maj.pdf",
    epubUrl: "https://example.com/maj.epub",
    genreId: "B1",
    genre: "poezie",
    rating: 4.1,
    ratingsCount: 890,
    url: "https://goodreads.com/book/maj",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
  {
    titulKey: 1008,
    title: "R.U.R.",
    author: "Karel Čapek",
    publisher: "Aventinum",
    year: 1920,
    detailUrl: "https://example.com/rur",
    subtitle: null,
    partTitle: null,
    imageUrl: null,
    imageWidth: null,
    imageHeight: null,
    description:
      "Hra, která do světa uvedla slovo 'robot'. Vědeckofantastické drama o umělé inteligenci.",
    pdfUrl: "https://example.com/rur.pdf",
    epubUrl: "https://example.com/rur.epub",
    genreId: "C1",
    genre: "divadlo",
    rating: 4.4,
    ratingsCount: 756,
    url: "https://goodreads.com/book/rur",
    mlpScrapedAt: SCRAPED_AT,
    goodreadsScrapedAt: SCRAPED_AT,
  },
];

/** Filter sample books by genre field. */
export function sampleBooksByGenre(genre: string): Book[] {
  return sampleBooks.filter((b) => b.genre === genre);
}

/** Group sample books into the BookGenre structure used by HomePage. */
export function createGenresFromBooks(books: Book[]) {
  const genreMap = new Map<string, Book[]>();

  for (const book of books) {
    if (book.genre) {
      const existing = genreMap.get(book.genre) ?? [];
      genreMap.set(book.genre, [...existing, book]);
    }
  }

  return Array.from(genreMap.entries()).map(([genre, genreBooks]) => ({
    genre: genre as "beletrie" | "poezie" | "divadlo" | "deti" | "ostatni",
    books: genreBooks,
    bookCount: genreBooks.length,
  }));
}

export const mockTimestamp = {
  lastUpdated: "2024-12-15T10:30:00.000Z",
  timestamp: 1734254200000,
};
