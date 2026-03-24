import type { Meta, StoryObj } from "@storybook/react-vite";
import { createGenresFromBooks, sampleBooks } from "./stories/sample-books.ts";
import { HomePage } from "./home-page.tsx";

const meta: Meta<typeof HomePage> = {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bookCount: sampleBooks.length,
    genres: createGenresFromBooks(sampleBooks),
    lastUpdated: "23. března 2026",
  },
};

export const Empty: Story = {
  args: {
    bookCount: 0,
    genres: [],
    lastUpdated: "23. března 2026",
  },
};
