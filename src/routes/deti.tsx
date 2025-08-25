import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";

export type Data = {
  books: any[];
};

const getDetiData = createServerFn({
  method: "GET",
}).handler(async (): Promise<Data> => {
  const { loadGenreData } = await import("#@/lib/server/genre-data-loader.ts");
  return await loadGenreData("deti");
});

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
  loader: async () => await getDetiData(),
  component: DetiComponent,
});

function DetiComponent() {
  const { books } = Route.useLoaderData();

  return <GenrePage books={books} genreKey="deti" />;
}
