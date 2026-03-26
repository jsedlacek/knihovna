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

export const Default: Story = {};
