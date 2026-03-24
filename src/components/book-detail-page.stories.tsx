import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleBook } from "./stories/sample-books.ts";
import { BookDetailPage } from "./book-detail-page.tsx";

const meta: Meta<typeof BookDetailPage> = {
  title: "Pages/BookDetailPage",
  component: BookDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    book: sampleBook,
  },
};

export const WithPartTitle: Story = {
  args: {
    book: {
      ...sampleBook,
      title: "Kronika o Narni",
      partTitle: "Lev, čarodějnice a skříň",
      author: "C. S. Lewis",
    },
  },
};

export const MinimalBook: Story = {
  args: {
    book: {
      ...sampleBook,
      subtitle: null,
      partTitle: null,
      imageUrl: null,
      description: null,
      publisher: null,
      year: null,
      rating: null,
      ratingsCount: null,
      url: null,
      epubUrl: null,
      pdfUrl: null,
    },
  },
};
