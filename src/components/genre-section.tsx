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
          <h2 className="text-lg font-bold mb-3">
            <a href={`/${genreKey}`} className="text-link hover:underline">
              {genreConfig.name}
            </a>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{genreConfig.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {books.map((book, index) => (
          <div
            key={`${genreKey}-${book.title}-${book.author}-${index}`}
            className="grid grid-cols-[min-content] max-w-48"
          >
            <BookCover
              src={book.imageUrl}
              alt={`${book.title} cover`}
              href={getBookDetailPath(book)}
              external={false}
              className="h-40 w-auto min-w-24 max-w-none mb-2"
              height={160}
            />
            <div className="w-0 min-w-full space-y-0.5">
              <a
                href={getBookDetailPath(book)}
                title={book.title}
                className="text-xs font-medium leading-snug line-clamp-2 hover:underline"
              >
                {book.title}
              </a>
              <p
                className="text-xs text-muted-foreground leading-snug truncate"
                title={book.author}
              >
                {book.author}
              </p>
              <div className="text-xs text-muted-foreground flex items-center">
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
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button href={`/${genreKey}`} variant="primary">
          Prohlédnout {genreConfig.nameAccusative} ({formatNumberCzech(bookCount)} knih) →
        </Button>
      </div>
    </section>
  );
}
