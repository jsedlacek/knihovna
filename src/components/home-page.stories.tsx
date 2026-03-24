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

export const Empty: Story = {
  args: {
    bookCount: 0,
    genres: [],
    lastUpdated: mockTimestamp,
  },
};
