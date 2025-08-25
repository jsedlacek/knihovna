import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";
import { loadGenreData } from "#@/lib/server/genre-data-loader.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

export type Data = {
  books: Book[];
};

const getData = createServerFn({
  method: "GET",
}).handler(async () => await loadGenreData("ostatni"));

export const Route = createFileRoute("/ostatni")({
  head: () => ({
    meta: [
      {
        title: "Ostatní - Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší ostatní e-knihy zdarma z městské knihovny. Rozmanité žánry a témata s hodnocením 4,0 a vyšším.",
      },
    ],
  }),
  loader: async () => await getData(),
  component: OstatniComponent,
});

function OstatniComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="ostatni" />;
}
