import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HomePage, type BookGenre } from "#@/components/home-page.tsx";
import { getBooks } from "#@/lib/server/books.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { errorLogging } from "#@/lib/server/utils/server-fn.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { groupBooksByGenre, type GenreGroup } from "#@/lib/shared/utils/genre-utils.ts";

const log = createLogger("route.home");

/**
 * Pick `count` random books from the top 10% by rating.
 * If the top 10% has fewer than `count` books, pick the top `count` instead.
 */
function pickFeaturedBooks(books: Book[], count: number): Book[] {
  if (books.length <= count) return books;

  const topPctSize = Math.ceil(books.length * 0.2);
  const poolSize = Math.max(topPctSize, count);
  const pool = books.slice(0, poolSize);

  // Fisher-Yates shuffle on the pool, then take first `count`
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return pool.slice(0, count);
}

export type Data = {
  bookCount: number;
  genres: BookGenre[];
};

const getHomeData = createServerFn({
  method: "GET",
})
  .middleware([errorLogging])
  .handler(async (): Promise<Data> => {
    const totalStart = performance.now();

    const fetchStart = performance.now();
    const books = await getBooks();
    log.info("Home handler", { step: "fetch", duration: performance.now() - fetchStart });

    const groupStart = performance.now();
    const booksByGenre = groupBooksByGenre(books);
    log.info("Home handler", { step: "groupByGenre", duration: performance.now() - groupStart });

    const genres: BookGenre[] = Object.entries(booksByGenre).map(([genre, books]) => ({
      genre: genre as GenreGroup,
      books: pickFeaturedBooks(books, 5),
      bookCount: books.length,
    }));

    log.info("Home handler", { step: "total", duration: performance.now() - totalStart });

    return {
      bookCount: books.length,
      genres,
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

const rootRouteApi = getRouteApi("__root__");

function HomeComponent() {
  const { bookCount, genres } = Route.useLoaderData();
  const { lastUpdated } = rootRouteApi.useLoaderData();

  return <HomePage bookCount={bookCount} genres={genres} lastUpdated={lastUpdated} />;
}
