import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AuthorLoadMoreResult } from "./author-page.tsx";
import { AuthorPage } from "./author-page.tsx";
import {
  sampleAuthor,
  sampleAuthorMinimal,
  sampleAuthorNoPhoto,
  sampleBooks,
  sampleBooksByGenre,
} from "./stories/sample-books.ts";

function mockLoadMore(_slug: string, _cursor: number): Promise<AuthorLoadMoreResult> {
  return Promise.resolve({
    books: sampleBooksByGenre("beletrie").slice(0, 2),
    nextCursor: null,
  });
}

const meta: Meta<typeof AuthorPage> = {
  title: "Pages/AuthorPage",
  component: AuthorPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooksByGenre("beletrie"),
    totalCount: 4,
    initialNextCursor: null,
    onLoadMore: mockLoadMore,
  },
};

export const WithLoadMore: Story = {
  args: {
    author: sampleAuthor,
    initialBooks: sampleBooks.slice(0, 4),
    totalCount: 30,
    initialNextCursor: 4,
    onLoadMore: mockLoadMore,
  },
};

export const NoPhoto: Story = {
  args: {
    author: sampleAuthorNoPhoto,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore,
  },
};

export const NoBio: Story = {
  args: {
    author: sampleAuthorMinimal,
    initialBooks: sampleBooksByGenre("beletrie").slice(0, 1),
    totalCount: 1,
    initialNextCursor: null,
    onLoadMore: mockLoadMore,
  },
};

export const Empty: Story = {
  args: {
    author: sampleAuthor,
    initialBooks: [],
    totalCount: 0,
    initialNextCursor: null,
    onLoadMore: mockLoadMore,
  },
};
