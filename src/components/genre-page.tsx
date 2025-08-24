import { BookCard } from "#@/components/book-card.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { sortBooksByScore } from "#@/lib/shared/utils/book-scoring.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

interface GenrePageProps {
  books: Book[];
  genreKey: keyof typeof GENRE_GROUPS;
  showScores?: boolean;
}

export function GenrePage({
  books,
  genreKey,
  showScores = false,
}: GenrePageProps) {
  const genreConfig = GENRE_GROUPS[genreKey];

  // Sort books by score within this genre
  const sortedBooks = sortBooksByScore(books);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header showBackLink />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">{genreConfig.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {genreConfig.description} ({formatNumberCzech(sortedBooks.length)}{" "}
              {sortedBooks.length === 1
                ? "kniha"
                : sortedBooks.length < 5
                  ? "knihy"
                  : "knih"}
              )
            </p>
          </div>
        </section>
        <section className="space-y-4">
          <div className="space-y-4">
            {sortedBooks.length > 0 ? (
              sortedBooks.map((book, index) => (
                <BookCard
                  key={`${genreKey}-${book.title}-${book.author}-${index}`}
                  book={book}
                  index={index}
                  showScores={showScores}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                V této kategorii nejsou momentálně k dispozici žádné knihy.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
