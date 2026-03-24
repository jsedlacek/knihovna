import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { sampleBook } from "./stories/sample-books.ts";
import { BookCard } from "./book-card.tsx";

const meta: Meta<typeof BookCard> = {
  title: "Components/BookCard",
  component: BookCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    showScores: {
      control: { type: "boolean" },
      description: "Whether to show the book score",
    },
    index: {
      control: { type: "number" },
      description: "Index of the book card (used for unique keys)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const bookWithoutRating: Book = {
  ...sampleBook,
  title: "Neznámá kniha",
  author: "Neznámý autor",
  rating: null,
  ratingsCount: null,
  url: null,
};

const bookWithLongTitle: Book = {
  ...sampleBook,
  title: "Velmi dlouhý název knihy, který se může rozložit na více řádků",
  subtitle: "s ještě delším podtitulem, který také zabírá hodně místa",
  description:
    "Velmi dlouhý popis knihy, který obsahuje mnoho detailů o ději, postavách a autorovi. Tento popis slouží k testování, jak se komponenta chová s delšími texty a zda správně ořezává text na třech řádcích pomocí line-clamp třídy.",
};

const bookWithoutImage: Book = {
  ...sampleBook,
  imageUrl: null,
};

const bookWithoutDownloads: Book = {
  ...sampleBook,
  epubUrl: null,
  pdfUrl: null,
};

const bookWithPartTitle: Book = {
  ...sampleBook,
  title: "Kronika o Narni",
  partTitle: "Lev, čarodějnice a skříň",
  author: "C. S. Lewis",
};

export const Default: Story = {
  args: {
    book: sampleBook,
    index: 0,
    showScores: false,
  },
};

export const WithScores: Story = {
  args: {
    book: sampleBook,
    index: 0,
    showScores: true,
  },
};

export const WithoutRating: Story = {
  args: {
    book: bookWithoutRating,
    index: 0,
    showScores: false,
  },
};

export const WithLongContent: Story = {
  args: {
    book: bookWithLongTitle,
    index: 0,
    showScores: false,
  },
};

export const WithoutImage: Story = {
  args: {
    book: bookWithoutImage,
    index: 0,
    showScores: false,
  },
};

export const WithoutDownloads: Story = {
  args: {
    book: bookWithoutDownloads,
    index: 0,
    showScores: false,
  },
};

export const WithPartTitle: Story = {
  args: {
    book: bookWithPartTitle,
    index: 0,
    showScores: false,
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-4 max-w-4xl">
      <BookCard book={sampleBook} index={0} showScores={true} />
      <BookCard book={bookWithoutRating} index={1} showScores={true} />
      <BookCard book={bookWithLongTitle} index={2} showScores={false} />
      <BookCard book={bookWithPartTitle} index={3} showScores={false} />
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};
