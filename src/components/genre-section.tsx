import { StarIcon } from "lucide-react";

import type { Book } from "#@/lib/shared/types/book-types.ts";
import { sortBooksByScore } from "#@/lib/shared/utils/book-scoring.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { BookCover } from "./ui/book-cover.tsx";
import { Button } from "./ui/button.tsx";
import { Card } from "./ui/card.tsx";

interface GenreSectionProps {
  books: Book[];
  genreKey: keyof typeof GENRE_GROUPS;
  bookCount: number;
}

export function GenreSection({
  books,
  genreKey,
  bookCount,
}: GenreSectionProps) {
  const genreConfig = GENRE_GROUPS[genreKey];

  // Sort books by score within this genre
  const sortedBooks = sortBooksByScore(books);

  // Don't render empty sections
  if (sortedBooks.length === 0) {
    return null;
  }

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold mb-2">
            <a href={`/${genreKey}`} className="hover:underline">
              {genreConfig.name}
            </a>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            {genreConfig.description}
          </p>
          <div className="text-xs text-muted-foreground">
            {formatNumberCzech(bookCount)} knih ke stažení
          </div>
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
              href={book.detailUrl}
              className="h-25 mb-1"
            />
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              {book.rating ? (
                <span className="inline-flex items-center">
                  <span>
                    {formatNumberCzech(Math.round(book.rating * 10) / 10)}
                  </span>
                  <StarIcon className="ml-1 size-2.5 fill-current" />
                </span>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button href={`/${genreKey}`} variant="primary">
          Zobrazit všechny knihy →
        </Button>
      </div>
    </Card>
  );
}
