import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "STÁHNOUT EPUB",
    href: "#",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "ZOBRAZIT PDF",
    href: "#",
    variant: "secondary",
  },
};
