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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    genreKey: "beletrie",
    onLoadMore: mockLoadMore,
  },
};

export const WithLoadMore: Story = {
  args: {
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    genreKey: "beletrie",
    onLoadMore: mockLoadMore,
  },
};

export const Empty: Story = {
  args: {
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    genreKey: "ostatni",
    onLoadMore: mockLoadMore,
  },
};
