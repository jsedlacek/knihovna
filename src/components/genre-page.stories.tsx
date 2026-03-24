import type { Meta, StoryObj } from "@storybook/react-vite";
import type { LoadMoreResult } from "./genre-page.tsx";
import { GenrePage } from "./genre-page.tsx";
import { sampleBooks, sampleBooksByGenre } from "./stories/sample-books.ts";

function mockLoadMore(_genre: string, _cursor: number): Promise<LoadMoreResult> {
  return Promise.resolve({
    books: sampleBooksByGenre("beletrie").slice(0, 2),
    nextCursor: null,
  });
}

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
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    genreKey: "beletrie",
    showScores: false,
    onLoadMore: mockLoadMore,
  },
};

export const Poezie: Story = {
  args: {
    initialBooks: sampleBooksByGenre("poezie"),
    totalCount: 2,
    initialNextCursor: null,
    genreKey: "poezie",
    showScores: false,
    onLoadMore: mockLoadMore,
  },
};

export const Divadlo: Story = {
  args: {
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    genreKey: "divadlo",
    showScores: false,
    onLoadMore: mockLoadMore,
  },
};

export const Deti: Story = {
  args: {
    initialBooks: sampleBooksByGenre("deti"),
    totalCount: 1,
    initialNextCursor: null,
    genreKey: "deti",
    showScores: false,
    onLoadMore: mockLoadMore,
  },
};

export const WithScores: Story = {
  args: {
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    genreKey: "beletrie",
    showScores: true,
    onLoadMore: mockLoadMore,
  },
};

export const WithManyBooks: Story = {
  args: {
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    genreKey: "beletrie",
    showScores: false,
    onLoadMore: mockLoadMore,
  },
};

export const EmptyGenre: Story = {
  args: {
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    genreKey: "ostatni",
    showScores: false,
    onLoadMore: mockLoadMore,
  },
};
