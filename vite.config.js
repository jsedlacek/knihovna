import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

function copyDataPlugin() {
  return {
    name: "copy-data",
    writeBundle() {
      const src = resolve("data/books.sqlite");
      const destDir = resolve("dist/client/data");
      mkdirSync(destDir, { recursive: true });
      copyFileSync(src, resolve(destDir, "books.sqlite"));
    },
  };
}

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({}),
    viteReact(),
    copyDataPlugin(),
  ],
});
