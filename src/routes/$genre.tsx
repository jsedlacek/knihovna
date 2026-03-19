import { createFileRoute, notFound } from "@tanstack/react-router";
import { GenrePage } from "#@/components/genre-page.tsx";
import { books } from "#@/lib/server/books.ts";
import {
  getBooksForGenreGroup,
  GENRE_GROUPS,
  type GenreGroup,
} from "#@/lib/shared/utils/genre-utils.ts";

function isValidGenre(genre: string): genre is GenreGroup {
  return genre in GENRE_GROUPS;
}

export const Route = createFileRoute("/$genre")({
  loader: async ({ params }) => {
    if (!isValidGenre(params.genre)) {
      throw notFound();
    }

    return getBooksForGenreGroup(books, params.genre);
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
