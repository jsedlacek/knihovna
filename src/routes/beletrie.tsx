import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";
import { loadGenreData } from "#@/lib/server/genre-data-loader.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

export type Data = {
  books: Book[];
};

const getBeletrieData = createServerFn({
  method: "GET",
}).handler(async () => {
  return await loadGenreData("beletrie");
});

export const Route = createFileRoute("/beletrie")({
  head: () => ({
    meta: [
      {
        title: "Beletrie - Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší beletrie e-knihy zdarma z městské knihovny. Současná próza, romány a novely s hodnocením 4,0 a vyšším.",
      },
    ],
  }),
  loader: async () => await getBeletrieData(),
  component: BeletrieComponent,
});

function BeletrieComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="beletrie" />;
}
