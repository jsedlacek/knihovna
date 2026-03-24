import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link.tsx";

const meta: Meta<typeof Link> = {
  title: "UI/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Karel Čapek – Krakatit",
    href: "#",
  },
};
