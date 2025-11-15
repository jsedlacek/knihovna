import { createFileRoute, notFound } from "@tanstack/react-router";
import { GenrePage } from "#@/components/genre-page.tsx";
import { books } from "#@/lib/server/books.ts";
import {
  getBooksForGenreGroup,
  GENRE_GROUPS,
} from "#@/lib/shared/utils/genre-utils.ts";
import type { GenreGroup } from "#@/lib/shared/utils/genre-utils.ts";

const GENRE_METADATA = {
  beletrie: {
    title: "Beletrie - Nejlepší e-knihy zdarma",
    description:
      "Nejlepší beletrie e-knihy zdarma z městské knihovny. Současná próza, romány a novely s hodnocením 4,0 a vyšším.",
  },
  poezie: {
    title: "Poezie - Nejlepší e-knihy zdarma",
    description:
      "Nejlepší poezie e-knihy zdarma z městské knihovny. Klasické i současné básnické sbírky s hodnocením 4,0 a vyšším.",
  },
  divadlo: {
    title: "Divadlo - Nejlepší e-knihy zdarma",
    description:
      "Nejlepší divadelní hry e-knihy zdarma z městské knihovny. Klasické i současné divadelní texty s hodnocením 4,0 a vyšším.",
  },
  deti: {
    title: "Dětské knihy - Nejlepší e-knihy zdarma",
    description:
      "Nejlepší dětské e-knihy zdarma z městské knihovny. Knížky pro děti všech věkových kategorií s hodnocením 4,0 a vyšším.",
  },
  ostatni: {
    title: "Ostatní - Nejlepší e-knihy zdarma",
    description:
      "Nejlepší ostatní e-knihy zdarma z městské knihovny. Rozmanité žánry a témata s hodnocením 4,0 a vyšším.",
  },
} as const;

export const Route = createFileRoute("/$genre")({
  head: ({ params }) => {
    const genreKey = params.genre as GenreGroup;
    const metadata = GENRE_METADATA[genreKey];

    if (!metadata) {
      return {};
    }

    return {
      meta: [
        {
          title: metadata.title,
        },
        {
          name: "description",
          content: metadata.description,
        },
      ],
    };
  },
  component: BeletrieComponent,
});

function BeletrieComponent() {
  const params = Route.useParams();
  const genre = params.genre as GenreGroup;

  if (!GENRE_GROUPS[genre]) {
    throw notFound();
  }

  const genreBooks = getBooksForGenreGroup(books, genre);

  return <GenrePage books={genreBooks} genreKey={genre} />;
}
