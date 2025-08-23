import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "static",
  build: {
    assets: "assets",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
