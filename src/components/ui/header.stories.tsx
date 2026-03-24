import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./header.tsx";

const meta: Meta<typeof Header> = {
  title: "UI/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithBreadcrumbs: Story = {
  args: {
    breadcrumbs: [{ label: "Beletrie" }],
  },
};

export const WithGenreAndBook: Story = {
  args: {
    breadcrumbs: [{ label: "Beletrie", href: "/beletrie" }, { label: "Válka s mloky" }],
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: "Čapek",
    breadcrumbs: [{ label: "Hledání" }],
  },
};
