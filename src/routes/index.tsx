import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HomePage } from "#@/components/home-page.tsx";

export type Data = {
  books: any[];
  lastUpdated: any | null;
};

const getHomeData = createServerFn({
  method: "GET",
}).handler(async (): Promise<Data> => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { loadScrapingTimestamp } = await import(
    "#@/lib/server/utils/timestamp-utils.ts"
  );

  // Read the books data at build time
  const booksPath = path.join(process.cwd(), "data", "books.json");
  let books: any[] = [];

  try {
    const booksData = fs.readFileSync(booksPath, "utf-8");
    books = JSON.parse(booksData);
  } catch (error) {
    console.warn(
      "Could not read books.json, using empty array:",
      error instanceof Error ? error.message : String(error),
    );
  }

  // Read the timestamp data at build time
  const lastUpdated = await loadScrapingTimestamp();

  return {
    books,
    lastUpdated,
  };
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší české e-knihy zdarma z městské knihovny. Moderní romány, klasika, poezie i divadelní hry s hodnocením 4,0 a vyšším.",
      },
    ],
  }),
  loader: async () => await getHomeData(),
  component: HomeComponent,
});

function HomeComponent() {
  const { books, lastUpdated } = Route.useLoaderData();

  return <HomePage books={books} lastUpdated={lastUpdated} />;
}
