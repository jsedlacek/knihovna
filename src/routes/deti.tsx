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
}).handler(async () => await loadGenreData("deti"));

export const Route = createFileRoute("/deti")({
  head: () => ({
    meta: [
      {
        title: "Dětské knihy - Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší dětské e-knihy zdarma z městské knihovny. Knížky pro děti všech věkových kategorií s hodnocením 4,0 a vyšším.",
      },
    ],
  }),
  loader: async () => await getData(),
  component: DetiComponent,
});

function DetiComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="deti" />;
}
