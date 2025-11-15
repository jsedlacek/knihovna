import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookCover } from "./book-cover";

const meta: Meta<typeof BookCover> = {
  title: "UI/BookCover",
  component: BookCover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: "https://covers.openlibrary.org/b/id/240726-M.jpg",
    alt: "Sample book cover",
  },
};

export const WithLink: Story = {
  args: {
    src: "https://covers.openlibrary.org/b/id/240726-M.jpg",
    alt: "Sample book cover with link",
    href: "#",
  },
};

export const WithPlaceholder: Story = {
  args: {
    alt: "Book with placeholder cover",
  },
};

export const WithBrokenImage: Story = {
  args: {
    src: "https://invalid-url.com/broken-image.jpg",
    alt: "Book with broken image (fallback to placeholder)",
  },
};
