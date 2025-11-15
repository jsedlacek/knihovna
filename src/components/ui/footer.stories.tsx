import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta: Meta<typeof Footer> = {
  title: "UI/Footer",
  component: Footer,
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
