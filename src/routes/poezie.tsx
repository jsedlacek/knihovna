import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";

export type Data = {
  books: any[];
};

const getPoezieData = createServerFn({
  method: "GET",
}).handler(async (): Promise<Data> => {
  const { loadGenreData } = await import("#@/lib/server/genre-data-loader.ts");
  return await loadGenreData("poezie");
});

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
  loader: async () => await getPoezieData(),
  component: PoezieComponent,
});

function PoezieComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="poezie" />;
}
