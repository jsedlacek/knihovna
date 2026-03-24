import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, type ButtonProps } from "./button.tsx";

const meta: Meta<ButtonProps> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const PrimaryLink: Story = {
  render: () => (
    <Button href="#" variant="primary">
      Stáhnout EPUB
    </Button>
  ),
};

export const SecondaryLink: Story = {
  render: () => (
    <Button href="#" variant="secondary">
      Zobrazit PDF
    </Button>
  ),
};

export const ActionButton: Story = {
  render: () => (
    <Button onClick={() => {}} variant="primary">
      Načíst další
    </Button>
  ),
};

export const DisabledButton: Story = {
  render: () => (
    <Button onClick={() => {}} variant="primary" disabled>
      Načítání…
    </Button>
  ),
};
