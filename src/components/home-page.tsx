import { GenreSection } from "#@/components/genre-section.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import { filterBlockedBooks } from "#@/lib/shared/config/book-block-list.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { deduplicateBooks } from "#@/lib/shared/utils/book-deduplication.ts";
import { sortBooksByScore } from "#@/lib/shared/utils/book-scoring.ts";
import { formatDateCzech } from "#@/lib/shared/utils/date-utils.ts";
import { getBooksForGenreGroup } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

interface TimestampData {
  lastUpdated: string;
  timestamp: number;
}

interface HomePageProps {
  books: Book[];
  lastUpdated?: TimestampData | null;
}

export function HomePage({ books, lastUpdated }: HomePageProps) {
  const formattedLastUpdated = lastUpdated
    ? formatDateCzech(lastUpdated.lastUpdated)
    : null;

  // First filter out blocked books
  const unblockedBooks = filterBlockedBooks(books);

  // Remove duplicate books, keeping only the newer version
  const deduplicatedBooks = deduplicateBooks(unblockedBooks);

  // Then filter books with a rating of 4.0 or higher and have EPUB download links
  const filteredBooks = deduplicatedBooks.filter(
    (book) => book.rating !== null && book.rating >= 4.0 && book.epubUrl,
  );

  // Sort all books by score
  const sortedBooks = sortBooksByScore(filteredBooks);

  // Enable score display for debugging (set to true to show scores)
  const showScores = false;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header
        {...(lastUpdated &&
          formattedLastUpdated && {
            subtitle: `Aktualizováno ${formattedLastUpdated}`,
          })}
      />

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <section className="space-y-4">
          <div className="text-sm leading-relaxed space-y-4">
            <p>
              Tady najdete {formatNumberCzech(sortedBooks.length)} románů,
              klasiky, poezie i divadla – všechno, co má od čtenářů aspoň čtyři
              hvězdičky. A hlavně zdarma ke stažení z městské knihovny.
            </p>
          </div>
        </section>

        {/* Genre sections */}
        <div className="space-y-8">
          <GenreSection
            books={getBooksForGenreGroup(sortedBooks, "beletrie")}
            genreKey="beletrie"
            showScores={showScores}
            maxBooks={100}
          />

          <GenreSection
            books={getBooksForGenreGroup(sortedBooks, "poezie")}
            genreKey="poezie"
            showScores={showScores}
            maxBooks={100}
          />

          <GenreSection
            books={getBooksForGenreGroup(sortedBooks, "divadlo")}
            genreKey="divadlo"
            showScores={showScores}
            maxBooks={100}
          />

          <GenreSection
            books={getBooksForGenreGroup(sortedBooks, "deti")}
            genreKey="deti"
            showScores={showScores}
            maxBooks={100}
          />

          <GenreSection
            books={getBooksForGenreGroup(sortedBooks, "ostatni")}
            genreKey="ostatni"
            showScores={showScores}
            maxBooks={100}
          />
        </div>

        {/* Fallback if no books */}
        {books.length === 0 && (
          <section className="space-y-4">
            <p className="text-muted-foreground">
              Žádné knihy nejsou momentálně k dispozici. Zkontrolujte soubor
              data/books.json.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
