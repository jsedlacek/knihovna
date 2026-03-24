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

export const WithSubtitle: Story = {
  args: {
    book: {
      ...sampleBook,
      title: "Krakatit",
      subtitle: "Román o vynálezci výbušniny",
    },
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
    },
  },
};

export const NoDownloadLinks: Story = {
  args: {
    book: {
      ...sampleBook,
      epubUrl: null,
      pdfUrl: null,
    },
  },
};

export const EpubOnly: Story = {
  args: {
    book: {
      ...sampleBook,
      pdfUrl: null,
    },
  },
};

export const PdfOnly: Story = {
  args: {
    book: {
      ...sampleBook,
      epubUrl: null,
    },
  },
};
