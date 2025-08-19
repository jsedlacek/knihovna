import { useState } from "react";
import { sortBooksByScore } from "#@/lib/shared/utils/book-scoring.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import BookCard from "#@/components/book-card.tsx";

interface GenreSectionProps {
  books: Book[];
  genreKey: keyof typeof GENRE_GROUPS;
  showScores?: boolean;
  maxBooks?: number;
}

export default function GenreSection({
  books,
  genreKey,
  showScores = false,
  maxBooks = 10,
}: GenreSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const genreConfig = GENRE_GROUPS[genreKey];

  // Sort books by score within this genre
  const sortedBooks = sortBooksByScore(books);

  // Don't render empty sections
  if (sortedBooks.length === 0) {
    return null;
  }

  // Determine which books to show
  const hasMoreBooks = sortedBooks.length > maxBooks;
  const booksToShow = showAll ? sortedBooks : sortedBooks.slice(0, maxBooks);

  return (
    <section className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="text-sm sm:text-base font-bold">{genreConfig.name}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {genreConfig.description} ({formatNumberCzech(sortedBooks.length)}{" "}
          {sortedBooks.length === 1
            ? "kniha"
            : sortedBooks.length < 5
              ? "knihy"
              : "knih"}
          )
        </p>
      </div>
      <div className="space-y-4">
        {booksToShow.map((book, index) => (
          <BookCard
            key={`${genreKey}-${book.title}-${book.author}-${index}`}
            book={book}
            index={index}
            showScores={showScores}
          />
        ))}

        {hasMoreBooks && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
            >
              {showAll
                ? `Zobrazit méně`
                : `Zobrazit všech ${formatNumberCzech(sortedBooks.length)} knih v sekci ${genreConfig.name}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
