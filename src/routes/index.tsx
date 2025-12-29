import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HomePage, type BookGenre } from "#@/components/home-page.tsx";
import { books, lastUpdated } from "#@/lib/server/books.ts";
import { groupBooksByGenre, type GenreGroup } from "#@/lib/shared/utils/genre-utils.ts";

export type Data = {
  bookCount: number;
  genres: BookGenre[];
  lastUpdated: any | null;
};

const getHomeData = createServerFn({
  method: "GET",
}).handler(async (): Promise<Data> => {
  const booksByGenre = groupBooksByGenre(books);

  const genres: BookGenre[] = Object.entries(booksByGenre).map(([genre, books]) => ({
    genre: genre as GenreGroup,
    books: books.slice(0, 100),
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
    ],
  }),
  loader: async () => await getHomeData(),
  component: HomeComponent,
});

function HomeComponent() {
  const { bookCount, genres, lastUpdated } = Route.useLoaderData();

  return <HomePage bookCount={bookCount} genres={genres} lastUpdated={lastUpdated} />;
}
