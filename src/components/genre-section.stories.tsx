import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleBooks, sampleBooksByGenre } from "./stories/sample-books.ts";
import { GenreSection } from "./genre-section.tsx";

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
    books: sampleBooksByGenre("beletrie"),
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
