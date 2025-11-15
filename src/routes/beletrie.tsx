import { createFileRoute } from "@tanstack/react-router";
import { GenrePage } from "#@/components/genre-page.tsx";
import { books } from "#@/lib/server/books.ts";
import { getBooksForGenreGroup } from "#@/lib/shared/utils/genre-utils.ts";

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
  loader: async () => {
    return getBooksForGenreGroup(books, "beletrie");
  },
  component: BeletrieComponent,
});

function BeletrieComponent() {
  const books = Route.useLoaderData();

  return <GenrePage books={books} genreKey="beletrie" />;
}
