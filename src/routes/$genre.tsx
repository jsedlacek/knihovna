import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GenrePage } from "#@/components/genre-page.tsx";
import { getBooks } from "#@/lib/server/books.ts";
import {
  getBooksForGenreGroup,
  GENRE_GROUPS,
  type GenreGroup,
} from "#@/lib/shared/utils/genre-utils.ts";

function isValidGenre(genre: string): genre is GenreGroup {
  return genre in GENRE_GROUPS;
}

const getGenreBooks = createServerFn({
  method: "GET",
})
  .inputValidator((d: string) => d as GenreGroup)
  .handler(async ({ data: genre }) => {
    const books = await getBooks();
    return getBooksForGenreGroup(books, genre);
  });

export const Route = createFileRoute("/$genre")({
  loader: async ({ params }) => {
    if (!isValidGenre(params.genre)) {
      throw notFound();
    }

    return getGenreBooks({ data: params.genre });
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

function GenreComponent() {
  const books = Route.useLoaderData();
  const { genre } = Route.useParams();

  if (!isValidGenre(genre)) {
    return null;
  }

  return <GenrePage books={books} genreKey={genre} />;
}
