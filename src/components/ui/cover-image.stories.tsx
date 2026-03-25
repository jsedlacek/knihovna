import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoverImage } from "./cover-image.tsx";

const meta: Meta<typeof CoverImage> = {
  title: "UI/CoverImage",
  component: CoverImage,
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

export const WithPlaceholder: Story = {
  args: {
    alt: "Book with placeholder cover",
  },
};
