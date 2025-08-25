import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackStart({ target: "cloudflare-module", customViteReactPlugin: true }),
    tailwindcss(),
    react(),
  ],
});
