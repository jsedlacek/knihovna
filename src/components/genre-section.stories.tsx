import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GenreSection } from "./genre-section";

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
    description: "Román o vynálezci výbušniny, která může zničit svět.",
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
      "Satirický román o konfliktu mezi lidstvem a inteligentními mlaky.",
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
    title: "R.U.R.",
    author: "Karel Čapek",
    publisher: "Aventinum",
    year: 1920,
    detailUrl: "https://example.com/rur",
    subtitle: null,
    partTitle: null,
    imageUrl: null,
    description: "Hra, která do světa uvedla slovo 'robot'.",
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
    title: "Babička",
    author: "Božena Němcová",
    publisher: null,
    year: 1855,
    detailUrl: "https://example.com/babicka",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/123456-M.jpg",
    description: "Klasický český román o životě na venkově.",
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
    title: "Kytice",
    author: "Karel Jaromír Erben",
    publisher: null,
    year: 1853,
    detailUrl: "https://example.com/kytice",
    subtitle: null,
    partTitle: null,
    imageUrl: "https://covers.openlibrary.org/b/id/654321-M.jpg",
    description: "Sbírka balad inspirovaných lidovou slovesností.",
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

const meta: Meta<typeof GenreSection> = {
  title: "Components/GenreSection",
  component: GenreSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    genreKey: {
      control: { type: "select" },
      options: ["beletrie", "poezie", "divadlo", "deti", "ostatni"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Beletrie: Story = {
  args: {
    books: sampleBooks.filter((book) => book.genre === "beletrie"),
    genreKey: "beletrie",
  },
};

export const WithOneBook: Story = {
  args: {
    books: sampleBooks.slice(0, 1),
    genreKey: "beletrie",
  },
};

export const EmptySection: Story = {
  args: {
    books: [],
    genreKey: "beletrie",
  },
};
