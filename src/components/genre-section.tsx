import { sortBooksByScore } from "#@/lib/shared/utils/book-scoring.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import placeholderCover from "#@/images/book-placeholder.svg";
import { StarIcon } from "lucide-react";

interface GenreSectionProps {
  books: Book[];
  genreKey: keyof typeof GENRE_GROUPS;
  showScores?: boolean;
  maxBooks?: number;
}

export default function GenreSection({
  books,
  genreKey,
  maxBooks = 5,
}: GenreSectionProps) {
  const genreConfig = GENRE_GROUPS[genreKey];

  // Sort books by score within this genre
  const sortedBooks = sortBooksByScore(books);

  // Don't render empty sections
  if (sortedBooks.length === 0) {
    return null;
  }

  // Get featured books to display (limited number)
  const featuredBooks = sortedBooks.slice(0, maxBooks);

  return (
    <div className="bg-card p-4 sm:p-6 border border-border space-y-4">
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
            {formatNumberCzech(sortedBooks.length)} knih ke stažení
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {featuredBooks.map((book, index) => (
          <div
            key={`${genreKey}-${book.title}-${book.author}-${index}`}
            className="flex-shrink-0 text-center"
          >
            <a
              href={book.detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={book.imageUrl || placeholderCover.src}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== placeholderCover.src)
                    img.src = placeholderCover.src;
                }}
                alt={`${book.title} cover`}
                className="h-25 object-cover border border-border mb-1 hover:opacity-80 transition-opacity"
              />
            </a>
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
        <a
          href={`/${genreKey}`}
          className="bg-gray-200 text-gray-900 px-4 py-2 text-xs font-mono border-1 border-gray-400 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 shadow-[1px_1px_0px_0px_rgb(107,114,128)] uppercase tracking-wide inline-flex items-center justify-center"
        >
          Zobrazit všechny knihy →
        </a>
      </div>
    </div>
  );
}
