import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./link";

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

export const RatingsLink: Story = {
  args: {
    children: "1.2k hodnocení",
    href: "#",
    className: "text-blue-600",
  },
};

export const InternalLink: Story = {
  args: {
    children: "Internal link",
    href: "/beletrie",
    target: "_self",
  },
};
