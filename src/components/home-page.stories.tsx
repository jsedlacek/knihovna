import type { Meta, StoryObj } from "@storybook/react-vite";
import { createGenresFromBooks, mockTimestamp, sampleBooks } from "./stories/sample-books.ts";
import { HomePage } from "./home-page.tsx";

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
    bookCount: {
      control: { type: "number" },
      description: "Total number of books",
    },
    genres: {
      control: { type: "object" },
      description: "Array of genre objects with books",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bookCount: sampleBooks.length,
    genres: createGenresFromBooks(sampleBooks),
    lastUpdated: mockTimestamp,
  },
};

export const WithoutTimestamp: Story = {
  args: {
    bookCount: sampleBooks.length,
    genres: createGenresFromBooks(sampleBooks),
    lastUpdated: null,
  },
};

export const WithManyBooks: Story = {
  args: {
    bookCount: sampleBooks.length * 3,
    genres: createGenresFromBooks([
      ...sampleBooks,
      ...sampleBooks.map((book) => ({
        ...book,
        title: `${book.title} (kopie)`,
      })),
      ...sampleBooks.map((book) => ({
        ...book,
        title: `${book.title} (další kopie)`,
      })),
    ]),
    lastUpdated: mockTimestamp,
  },
};

export const WithFewBooks: Story = {
  args: {
    bookCount: 3,
    genres: createGenresFromBooks(sampleBooks.slice(0, 3)),
    lastUpdated: mockTimestamp,
  },
};

export const EmptyLibrary: Story = {
  args: {
    bookCount: 0,
    genres: [],
    lastUpdated: mockTimestamp,
  },
};

export const OnlyBeletrie: Story = {
  args: {
    bookCount: sampleBooks.filter((book) => book.genre === "beletrie").length,
    genres: createGenresFromBooks(sampleBooks.filter((book) => book.genre === "beletrie")),
    lastUpdated: mockTimestamp,
  },
};
