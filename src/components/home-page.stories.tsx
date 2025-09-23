import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { HomePage } from "./home-page";

const sampleBooks: Book[] = [
  {
    title: "Krakatit",
    author: "Karel Čapek",
    publisher: "Československý spisovatel",
    year: 1922,
    detailUrl: "https://example.com/krakatit",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/240726-M.jpg",
    description:
      "Román o vynálezci výbušniny, která může zničit svět. Příběh sleduje mladého chemika, který objeví tajemnou látku schopnou obrovské destrukce.",
    pdfUrl: "https://example.com/krakatit.pdf",
    epubUrl: "https://example.com/krakatit.epub",
    genreId: "beletrie",
    genre: "beletrie",
    rating: 4.6,
    ratingsCount: 1234,
    url: "https://goodreads.com/book/krakatit",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "Válka s mloky",
    author: "Karel Čapek",
    publisher: "Československý spisovatel",
    year: 1936,
    detailUrl: "https://example.com/valka-s-mloky",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/8225261-M.jpg",
    description:
      "Satirický román o konfliktu mezi lidstvem a inteligentními mlaky. Čapkovo dílo je varováním před technologickým pokrokem bez etických zásad.",
    pdfUrl: null,
    epubUrl: "https://example.com/valka-s-mloky.epub",
    genreId: "beletrie",
    genre: "beletrie",
    rating: 4.5,
    ratingsCount: 987,
    url: "https://goodreads.com/book/valka-s-mloky",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "Babička",
    author: "Božena Němcová",
    publisher: null,
    year: 1855,
    detailUrl: "https://example.com/babicka",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/123456-M.jpg",
    description:
      "Klasický český román o životě na venkově v 19. století. Příběh zachycuje idylický svět moravské vesnice očima dítěte.",
    pdfUrl: "https://example.com/babicka.pdf",
    epubUrl: "https://example.com/babicka.epub",
    genreId: "beletrie",
    genre: "beletrie",
    rating: 4.3,
    ratingsCount: 2100,
    url: "https://goodreads.com/book/babicka",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "Malý princ",
    author: "Antoine de Saint-Exupéry",
    publisher: "Gallimard",
    year: 1943,
    detailUrl: "https://example.com/maly-princ",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/789012-M.jpg",
    description:
      "Filozofická pohádka o malém princi, který cestuje mezi planetami a hledá smysl života a přátelství.",
    pdfUrl: "https://example.com/maly-princ.pdf",
    epubUrl: "https://example.com/maly-princ.epub",
    genreId: "deti",
    genre: "deti",
    rating: 4.7,
    ratingsCount: 5432,
    url: "https://goodreads.com/book/maly-princ",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "Kytice",
    author: "Karel Jaromír Erben",
    publisher: null,
    year: 1853,
    detailUrl: "https://example.com/kytice",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/654321-M.jpg",
    description:
      "Sbírka balad inspirovaných lidovou slovesností. Erbenovy básně zachycují tajemný svět českých pověstí a legend.",
    pdfUrl: null,
    epubUrl: "https://example.com/kytice.epub",
    genreId: "poezie",
    genre: "poezie",
    rating: 4.2,
    ratingsCount: 1543,
    url: "https://goodreads.com/book/kytice",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "R.U.R.",
    author: "Karel Čapek",
    publisher: "Aventinum",
    year: 1920,
    detailUrl: "https://example.com/rur",
    subtitle: null,
    partTitle: null,
    imageUrl: null,
    description:
      "Hra, která do světa uvedla slovo 'robot'. Vědeckofantastické drama o umělé inteligenci.",
    pdfUrl: "https://example.com/rur.pdf",
    epubUrl: "https://example.com/rur.epub",
    genreId: "divadlo",
    genre: "divadlo",
    rating: 4.4,
    ratingsCount: 756,
    url: "https://goodreads.com/book/rur",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "Máj",
    author: "Karel Hynek Mácha",
    publisher: null,
    year: 1836,
    detailUrl: "https://example.com/maj",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/345678-M.jpg",
    description:
      "Romantická básnická povídka o lásce, zradě a pomstě. Jedno z nejvýznamnějších děl české literatury.",
    pdfUrl: "https://example.com/maj.pdf",
    epubUrl: "https://example.com/maj.epub",
    genreId: "poezie",
    genre: "poezie",
    rating: 4.1,
    ratingsCount: 890,
    url: "https://goodreads.com/book/maj",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
  {
    title: "Osudy dobrého vojáka Švejka",
    author: "Jaroslav Hašek",
    publisher: "Adolf Synek",
    year: 1921,
    detailUrl: "https://example.com/svejk",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/456789-M.jpg",
    description:
      "Satirický román o prostém vojákovi během první světové války. Dílo plné humoru a kritiky vojenského systému.",
    pdfUrl: "https://example.com/svejk.pdf",
    epubUrl: "https://example.com/svejk.epub",
    genreId: "beletrie",
    genre: "beletrie",
    rating: 4.5,
    ratingsCount: 3210,
    url: "https://goodreads.com/book/svejk",
    mlpScrapedAt: "2024-01-15T10:30:00Z",
    goodreadsScrapedAt: "2024-01-15T10:30:00Z",
  },
];

const mockTimestamp = {
  lastUpdated: "2024-12-15T10:30:00.000Z",
  timestamp: 1734254200000,
};

const meta: Meta<typeof HomePage> = {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    lastUpdated: {
      control: { type: "object" },
      description: "Last update timestamp information",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    books: sampleBooks,
    lastUpdated: mockTimestamp,
  },
};

export const WithoutTimestamp: Story = {
  args: {
    books: sampleBooks,
    lastUpdated: null,
  },
};

export const WithManyBooks: Story = {
  args: {
    books: [
      ...sampleBooks,
      ...sampleBooks.map((book) => ({
        ...book,
        title: `${book.title} (kopie)`,
      })),
      ...sampleBooks.map((book) => ({
        ...book,
        title: `${book.title} (další kopie)`,
      })),
    ],
    lastUpdated: mockTimestamp,
  },
};

export const WithFewBooks: Story = {
  args: {
    books: sampleBooks.slice(0, 3),
    lastUpdated: mockTimestamp,
  },
};

export const EmptyLibrary: Story = {
  args: {
    books: [],
    lastUpdated: mockTimestamp,
  },
};

export const OnlyBeletrie: Story = {
  args: {
    books: sampleBooks.filter((book) => book.genre === "beletrie"),
    lastUpdated: mockTimestamp,
  },
};

export const WithLowRatedBooks: Story = {
  args: {
    books: sampleBooks.map((book) => ({ ...book, rating: 3.5 })),
    lastUpdated: mockTimestamp,
  },
};

export const WithoutEpubLinks: Story = {
  args: {
    books: sampleBooks.map((book) => ({ ...book, epubUrl: null })),
    lastUpdated: mockTimestamp,
  },
};
