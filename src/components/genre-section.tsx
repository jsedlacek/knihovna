import { StarIcon } from "lucide-react";

import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { getBookDetailPath } from "#@/lib/shared/utils/book-url-utils.ts";
import { BookCover } from "./ui/book-cover.tsx";
import { Button } from "./ui/button.tsx";

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
          <h2 className="text-xl font-bold mb-3">
            <a href={`/${genreKey}`} className="text-link hover:underline">
              {genreConfig.name}
            </a>
          </h2>
          <p className="text-sm text-muted-foreground">{genreConfig.description}</p>
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
              <BookCover
                src={book.imageUrl}
                alt={`${book.title} cover`}
                href={getBookDetailPath(book)}
                external={false}
                className="w-full mb-2"
                width={300}
                aspectRatio={aspectRatio}
              />
              <a
                href={getBookDetailPath(book)}
                title={book.title}
                className="text-sm font-medium leading-snug line-clamp-2 hover:underline block"
              >
                {book.title}
              </a>
              <p
                className="text-sm text-muted-foreground leading-snug truncate"
                title={book.author}
              >
                {book.author}
              </p>
              <div className="text-sm text-muted-foreground flex items-center">
                {book.rating ? (
                  <span className="inline-flex items-center">
                    <span>{formatNumberCzech(Math.round(book.rating * 10) / 10)}</span>
                    <StarIcon className="ml-1 size-2.5 fill-current" />
                  </span>
                ) : (
                  "N/A"
                )}
              </div>
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
