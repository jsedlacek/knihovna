import { StarIcon } from "lucide-react";

import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { getBookDetailPath } from "#@/lib/shared/utils/book-url-utils.ts";
import { BookCover } from "./ui/book-cover.tsx";
import { Button } from "./ui/button.tsx";

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
          <h2 className="text-lg font-bold mb-2">
            <a href={`/${genreKey}`} className="text-link hover:underline">
              {genreConfig.name}
            </a>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{genreConfig.description}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {books.map((book, index) => (
          <div
            key={`${genreKey}-${book.title}-${book.author}-${index}`}
            className="shrink-0 text-center snap-start"
          >
            <BookCover
              src={book.imageUrl}
              alt={`${book.title} cover`}
              href={getBookDetailPath(book)}
              external={false}
              className="h-36 mb-1"
              height={144}
            />
            <div className="text-xs text-muted-foreground flex items-center justify-center">
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
        ))}
        {bookCount > books.length && (
          <a
            href={`/${genreKey}`}
            className="shrink-0 snap-start flex items-center justify-center self-stretch w-24 rounded-md border border-border bg-muted/50 text-center text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            A dalších {formatNumberCzech(bookCount - books.length)} knih&nbsp;→
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button href={`/${genreKey}`} variant="primary">
          Všech {formatNumberCzech(bookCount)} knih →
        </Button>
      </div>
    </section>
  );
}
