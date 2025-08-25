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
}).handler(async () => await loadGenreData("poezie"));

export const Route = createFileRoute("/poezie")({
  head: () => ({
    meta: [
      {
        title: "Poezie - Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší poezie e-knihy zdarma z městské knihovny. Klasické i současné básnické sbírky s hodnocením 4,0 a vyšším.",
      },
    ],
  }),
  loader: async () => await getData(),
  component: PoezieComponent,
});

function PoezieComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="poezie" />;
}
