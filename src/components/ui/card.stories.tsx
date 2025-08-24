import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

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

export const WithFlexLayout: Story = {
  args: {
    className: "flex flex-col sm:flex-row gap-3 sm:gap-4",
    children: (
      <>
        <div className="flex-shrink-0">
          <div className="w-16 h-24 sm:w-20 sm:h-30 bg-gray-200 border border-border"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-2">Card with Flex Layout</h3>
          <p className="text-sm text-card-foreground">
            This card uses className to add flex layout behavior.
          </p>
        </div>
      </>
    ),
  },
};
