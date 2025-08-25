import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";

export type Data = {
  books: any[];
};

const getOstatniData = createServerFn({
  method: "GET",
}).handler(async (): Promise<Data> => {
  const { loadGenreData } = await import("#@/lib/server/genre-data-loader.ts");
  return await loadGenreData("ostatni");
});

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
  loader: async () => await getOstatniData(),
  component: OstatniComponent,
});

function OstatniComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="ostatni" />;
}
