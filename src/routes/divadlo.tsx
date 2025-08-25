import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";

export type Data = {
  books: any[];
};

const getDivadloData = createServerFn({
  method: "GET",
}).handler(async (): Promise<Data> => {
  const { loadGenreData } = await import("#@/lib/server/genre-data-loader.ts");
  return await loadGenreData("divadlo");
});

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
  loader: async () => await getDivadloData(),
  component: DivadloComponent,
});

function DivadloComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="divadlo" />;
}
