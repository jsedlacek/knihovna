import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchPage } from "./search-page.tsx";
import { sampleBooks } from "./stories/sample-books.ts";

const meta: Meta<typeof SearchPage> = {
  title: "Pages/SearchPage",
  component: SearchPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithResults: Story = {
  args: {
    query: "Čapek",
    books: sampleBooks.slice(0, 3),
  },
};

export const NoResults: Story = {
  args: {
    query: "neexistující kniha",
    books: [],
  },
};

export const ShortQuery: Story = {
  args: {
    query: "a",
    books: [],
  },
};

export const EmptyQuery: Story = {
  args: {
    query: "",
    books: [],
  },
};
