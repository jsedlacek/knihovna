import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card.tsx";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="font-bold text-sm mb-2">Sample Card Content</h3>
        <p className="text-sm text-card-foreground mb-2">
          This is a sample card with some content to show how it looks.
        </p>
      </div>
    ),
  },
};
