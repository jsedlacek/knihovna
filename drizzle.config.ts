import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/shared/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/books.sqlite",
  },
});
