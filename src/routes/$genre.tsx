import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";
import { getBooks } from "#@/lib/server/books.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { errorLogging } from "#@/lib/server/utils/server-fn.ts";
import {
  getBooksForGenreGroup,
  GENRE_GROUPS,
  type GenreGroup,
} from "#@/lib/shared/utils/genre-utils.ts";

const log = createLogger("route.genre");

const PAGE_SIZE = 20;

function isValidGenre(genre: string): genre is GenreGroup {
  return genre in GENRE_GROUPS;
}

export type GenreBooksResult = {
  books: Awaited<ReturnType<typeof getBooks>>;
  totalCount: number;
  nextCursor: number | null;
};

export const getGenreBooks = createServerFn({
  method: "GET",
})
  .middleware([errorLogging])
  .inputValidator(
    (d: { genre: string; cursor?: number }): { genre: GenreGroup; cursor: number } => {
      if (!(d.genre in GENRE_GROUPS)) {
        throw new Error(`Invalid genre: ${d.genre}`);
      }
      return { genre: d.genre as GenreGroup, cursor: d.cursor ?? 0 };
    },
  )
  .handler(async ({ data: { genre, cursor } }): Promise<GenreBooksResult> => {
    const totalStart = performance.now();

    const fetchStart = performance.now();
    const books = await getBooks();
    log.info("Genre handler", { step: "fetch", duration: performance.now() - fetchStart });

    const filterStart = performance.now();
    const genreBooks = getBooksForGenreGroup(books, genre);
    log.info("Genre handler", {
      step: "filterGenre",
      genre,
      duration: performance.now() - filterStart,
      count: genreBooks.length,
    });

    const page = genreBooks.slice(cursor, cursor + PAGE_SIZE);
    const nextCursor = cursor + PAGE_SIZE < genreBooks.length ? cursor + PAGE_SIZE : null;

    log.info("Genre handler", { step: "total", duration: performance.now() - totalStart });

    return { books: page, totalCount: genreBooks.length, nextCursor };
  });

export const Route = createFileRoute("/$genre")({
  loader: async ({ params }) => {
    if (!isValidGenre(params.genre)) {
      throw notFound();
    }

    return getGenreBooks({ data: { genre: params.genre, cursor: 0 } });
  },
  head: ({ params }) => {
    if (!isValidGenre(params.genre)) {
      return {};
    }

    const genreGroup = GENRE_GROUPS[params.genre];

    return {
      meta: [
        {
          title: genreGroup.title,
        },
        {
          name: "description",
          content: genreGroup.metaDescription,
        },
        {
          property: "og:title",
          content: genreGroup.title,
        },
        {
          property: "og:description",
          content: genreGroup.metaDescription,
        },
        {
          property: "og:url",
          content: `https://knihovna.jakub.contact/${params.genre}`,
        },
      ],
    };
  },
  component: GenreComponent,
});

const rootRouteApi = getRouteApi("__root__");

function GenreComponent() {
  const { books, totalCount, nextCursor } = Route.useLoaderData();
  const { genre } = Route.useParams();
  const { lastUpdated } = rootRouteApi.useLoaderData();

  if (!isValidGenre(genre)) {
    return null;
  }

  return (
    <GenrePage
      initialBooks={books}
      totalCount={totalCount}
      initialNextCursor={nextCursor}
      genreKey={genre}
      lastUpdated={lastUpdated}
      onLoadMore={async (g, cursor) => {
        return getGenreBooks({ data: { genre: g, cursor } });
      }}
    />
  );
}
