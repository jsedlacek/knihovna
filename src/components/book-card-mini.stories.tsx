import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleBook } from "./stories/sample-books.ts";
import { BookCardMini } from "./book-card-mini.tsx";

const meta: Meta<typeof BookCardMini> = {
  title: "Components/BookCardMini",
  component: BookCardMini,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 180 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    book: sampleBook,
  },
};

export const LongTitle: Story = {
  args: {
    book: {
      ...sampleBook,
      title:
        "Povídání o pejskovi a kočičce, jak spolu hospodařili a ještě o všelijakých jiných věcech",
    },
  },
};

export const WithoutRating: Story = {
  args: {
    book: {
      ...sampleBook,
      rating: null,
      ratingsCount: null,
    },
  },
};

export const WithoutImage: Story = {
  args: {
    book: {
      ...sampleBook,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
    },
  },
};
