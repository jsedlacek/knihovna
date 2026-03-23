import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HomePage, type BookGenre } from "#@/components/home-page.tsx";
import { getBooks, getLastUpdated } from "#@/lib/server/books.ts";
import { errorLogging } from "#@/lib/server/utils/server-fn.ts";
import type { TimestampData } from "#@/lib/shared/types/book-types.ts";
import { groupBooksByGenre, type GenreGroup } from "#@/lib/shared/utils/genre-utils.ts";

export type Data = {
  bookCount: number;
  genres: BookGenre[];
  lastUpdated: TimestampData | null;
};

const getHomeData = createServerFn({
  method: "GET",
})
  .middleware([errorLogging])
  .handler(async (): Promise<Data> => {
    const [books, lastUpdated] = await Promise.all([getBooks(), getLastUpdated()]);
    const booksByGenre = groupBooksByGenre(books);

    const genres: BookGenre[] = Object.entries(booksByGenre).map(([genre, books]) => ({
      genre: genre as GenreGroup,
      books: books.slice(0, 20),
      bookCount: books.length,
    }));

    return {
      bookCount: books.length,
      genres,
      lastUpdated,
    };
  });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší české e-knihy zdarma z městské knihovny. Moderní romány, klasika, poezie i divadelní hry s hodnocením 4,0 a vyšším.",
      },
      {
        property: "og:title",
        content: "Nejlepší e-knihy zdarma",
      },
      {
        property: "og:description",
        content:
          "Nejlepší české e-knihy zdarma z městské knihovny. Moderní romány, klasika, poezie i divadelní hry s hodnocením 4,0 a vyšším.",
      },
      {
        property: "og:url",
        content: "https://knihovna.jakub.contact",
      },
    ],
  }),
  loader: async () => await getHomeData(),
  component: HomeComponent,
});

function HomeComponent() {
  const { bookCount, genres, lastUpdated } = Route.useLoaderData();

  return <HomePage bookCount={bookCount} genres={genres} lastUpdated={lastUpdated} />;
}
