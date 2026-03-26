import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { BookGrid } from "./book-grid.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "./ui/link.tsx";

interface GenreSectionProps {
  books: Book[];
  genreKey: keyof typeof GENRE_GROUPS;
  bookCount: number;
}

export function GenreSection({ books, genreKey, bookCount }: GenreSectionProps) {
  const genreConfig = GENRE_GROUPS[genreKey];
  // Don't render empty sections
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-3">
            <Link href={`/${genreKey}`} external={false}>
              {genreConfig.name}
            </Link>
          </h2>
          <p className="text-base text-muted-foreground">{genreConfig.description}</p>
        </div>
      </div>

      <BookGrid books={books} keyPrefix={`${genreKey}-`} />

      <div className="flex items-center gap-4 pt-2">
        <Button href={`/${genreKey}`} variant="primary">
          Prohlédnout {genreConfig.nameAccusative} ({formatNumberCzech(bookCount)} knih) ☞
        </Button>
      </div>
    </section>
  );
}
