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
}).handler(async () => await loadGenreData("divadlo"));

export const Route = createFileRoute("/divadlo")({
  head: () => ({
    meta: [
      {
        title: "Divadlo - Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší divadelní hry e-knihy zdarma z městské knihovny. Klasické i současné divadelní texty s hodnocením 4,0 a vyšším.",
      },
    ],
  }),
  loader: async () => await getData(),
  component: DivadloComponent,
});

function DivadloComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="divadlo" />;
}
