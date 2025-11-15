import { createFileRoute } from "@tanstack/react-router";
import { GenrePage } from "#@/components/genre-page.tsx";
import { books } from "#@/lib/server/books.ts";
import {
  getBooksForGenreGroup,
  GENRE_GROUPS,
  type GenreGroup,
} from "#@/lib/shared/utils/genre-utils.ts";

export const Route = createFileRoute("/$genre")({
  loader: async ({ params }) => {
    const genre = params.genre as GenreGroup;

    return getBooksForGenreGroup(books, genre);
  },
  head: ({ params }) => {
    const genreKey = params.genre as GenreGroup;

    const genreGroup = GENRE_GROUPS[genreKey];

    if (!genreGroup) {
      return {};
    }

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
  const params = Route.useParams();

  const genre = params.genre as GenreGroup;

  return <GenrePage books={books} genreKey={genre} />;
}
