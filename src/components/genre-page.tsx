import { BookCard } from "#@/components/book-card.tsx";
import icon from "#@/images/icon.svg";
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
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-base font-bold">Nejlepší e-knihy zdarma</h1>
            <img src={icon} alt="Book icon" className="h-lh flex-shrink-0" />
          </div>
          <div className="text-sm text-muted-foreground">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Zpět na hlavní stránku
            </a>
          </div>
        </div>
      </header>

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

      <footer className="border-t border-border mt-12 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <div>
            Zdroje:{" "}
            <a
              href="https://mlp.cz"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Městská knihovna v Praze
            </a>
            ,{" "}
            <a
              href="https://goodreads.com"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Goodreads
            </a>
          </div>
          <div className="mt-2">
            Autor:{" "}
            <a
              href="https://jakub.contact/"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jakub Sedláček
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
