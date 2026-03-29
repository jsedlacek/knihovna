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

    // Disable image proxy so cover images load directly from their source URLs
    // (the Cloudflare /cdn-cgi/image proxy is not available in Storybook)
    config.define = {
      ...config.define,
      "import.meta.env.VITE_IMAGE_PROXY_ENABLED": JSON.stringify("false"),
    };

    // Remove Cloudflare and TanStack plugins — they prevent iframe.html from
    // being emitted during the Vite build. Use flat(Infinity) because these
    // plugins are often returned as deeply nested arrays.
    config.plugins = config.plugins
      ?.flat(Infinity)
      .filter(
        (p) =>
          !(p as Record<string, unknown>)?.name
            ?.toString()
            .match(/^(vite-plugin-cloudflare|tanstack)/),
      );
    return config;
  },
};

export default config;
