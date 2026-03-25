import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookRating } from "./book-rating.tsx";

const meta: Meta<typeof BookRating> = {
  title: "Components/BookRating",
  component: BookRating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 4.5,
    ratingsCount: 987,
    url: "https://goodreads.com/book/show/123",
  },
};

export const WithoutLink: Story = {
  args: {
    rating: 4.2,
    ratingsCount: 1500,
  },
};

export const WithoutCount: Story = {
  args: {
    rating: 3.8,
  },
};

export const NoRating: Story = {
  args: {
    rating: null,
  },
};

export const SizeBase: Story = {
  args: {
    rating: 4.5,
    ratingsCount: 3200,
    url: "https://goodreads.com/book/show/123",
    size: "base",
  },
};
