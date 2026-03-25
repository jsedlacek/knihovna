import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(config) {
    if (process.env.STORYBOOK_BASE) {
      config.base = process.env.STORYBOOK_BASE;
    }
    return config;
  },
};

export default config;
