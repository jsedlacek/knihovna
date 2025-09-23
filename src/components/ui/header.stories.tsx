import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./header";

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

export const WithSubtitle: Story = {
  args: {
    subtitle: "Aktualizováno 15. prosince 2024",
  },
};

export const WithBackLink: Story = {
  args: {
    showBackLink: true,
  },
};

export const GenrePage: Story = {
  args: {
    showBackLink: true,
  },
};
