import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { BookCardMini } from "./book-card-mini.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "./ui/link.tsx";

const DEFAULT_ASPECT_RATIO = 0.67; // typical book cover (2:3)

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

      <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-6">
        {books.map((book, index) => {
          const aspectRatio =
            book.imageWidth && book.imageHeight
              ? book.imageWidth / book.imageHeight
              : DEFAULT_ASPECT_RATIO;

          return (
            <div
              key={`${genreKey}-${book.title}-${book.author}-${index}`}
              className="min-w-0 sm:basis-0"
              style={{ flexGrow: aspectRatio }}
            >
              <BookCardMini book={book} />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button href={`/${genreKey}`} variant="primary">
          Prohlédnout {genreConfig.nameAccusative} ({formatNumberCzech(bookCount)} knih) →
        </Button>
      </div>
    </section>
  );
}
