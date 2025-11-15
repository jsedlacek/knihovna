import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GenrePage } from "./genre-page";

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
];

const meta: Meta<typeof GenrePage> = {
  title: "Pages/GenrePage",
  component: GenrePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    genreKey: {
      control: { type: "select" },
      options: ["beletrie", "poezie", "divadlo", "deti", "ostatni"],
    },
    showScores: {
      control: { type: "boolean" },
      description: "Show book scoring information",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Beletrie: Story = {
  args: {
    books: sampleBooks.filter((book) => book.genre === "beletrie"),
    genreKey: "beletrie",
    showScores: false,
  },
};

export const Poezie: Story = {
  args: {
    books: sampleBooks.filter((book) => book.genre === "poezie"),
    genreKey: "poezie",
    showScores: false,
  },
};

export const Divadlo: Story = {
  args: {
    books: [],
    genreKey: "divadlo",
    showScores: false,
  },
};

export const Deti: Story = {
  args: {
    books: sampleBooks.filter((book) => book.genre === "deti"),
    genreKey: "deti",
    showScores: false,
  },
};

export const WithScores: Story = {
  args: {
    books: sampleBooks.filter((book) => book.genre === "beletrie"),
    genreKey: "beletrie",
    showScores: true,
  },
};

export const WithManyBooks: Story = {
  args: {
    books: [
      ...sampleBooks.filter((book) => book.genre === "beletrie"),
      ...sampleBooks.filter((book) => book.genre === "beletrie"),
      ...sampleBooks.filter((book) => book.genre === "beletrie"),
    ],
    genreKey: "beletrie",
    showScores: false,
  },
};

export const EmptyGenre: Story = {
  args: {
    books: [],
    genreKey: "ostatni",
    showScores: false,
  },
};
