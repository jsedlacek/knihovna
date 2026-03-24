import { ArrowRightIcon, StarIcon } from "lucide-react";

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
  const remaining = bookCount - books.length;

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

      <div className="flex flex-wrap gap-2">
        {books.map((book, index) => (
          <div key={`${genreKey}-${book.title}-${book.author}-${index}`} className="w-28">
            <BookCover
              src={book.imageUrl}
              alt={`${book.title} cover`}
              href={getBookDetailPath(book)}
              external={false}
              className="h-36 mb-1"
              height={144}
            />
            <a
              href={getBookDetailPath(book)}
              title={book.title}
              className="text-xs font-medium leading-tight line-clamp-2 hover:underline"
            >
              {book.title}
            </a>
            <p className="text-xs text-muted-foreground leading-tight truncate" title={book.author}>
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
        ))}
        {bookCount > books.length && (
          <div>
            <a
              href={`/${genreKey}`}
              className="flex flex-col items-center justify-center gap-2 h-36 w-28 rounded-md border border-border bg-muted/50 text-center text-sm text-muted-foreground hover:bg-muted transition-colors px-2"
            >
              <span>
                A {remaining < 5 ? "další" : "dalších"} {formatNumberCzech(remaining)}{" "}
                {remaining === 1 ? "kniha" : remaining < 5 ? "knihy" : "knih"}
              </span>
              <ArrowRightIcon className="size-5" />
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button href={`/${genreKey}`} variant="primary">
          Prohlédnout {genreConfig.nameAccusative} ({formatNumberCzech(bookCount)} knih) →
        </Button>
      </div>
    </section>
  );
}
