import { GenreSection } from "#@/components/genre-section.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatDateCzech } from "#@/lib/shared/utils/date-utils.ts";
import { type GenreGroup } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

interface TimestampData {
  lastUpdated: string;
  timestamp: number;
}

export interface BookGenre {
  genre: GenreGroup;
  books: Book[];
  bookCount: number;
}

interface HomePageProps {
  bookCount: number;
  genres: BookGenre[];
  lastUpdated?: TimestampData | null;
}

export function HomePage({ bookCount, genres, lastUpdated }: HomePageProps) {
  const formattedLastUpdated = lastUpdated
    ? formatDateCzech(lastUpdated.lastUpdated)
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Header
        {...(lastUpdated &&
          formattedLastUpdated && {
            subtitle: `Aktualizováno ${formattedLastUpdated}`,
          })}
        suppressHydrationWarning
      />

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <section className="space-y-4">
          <div className="text-sm leading-relaxed space-y-4">
            <p>
              Tady najdete{" "}
              <span className="font-semibold">
                {formatNumberCzech(bookCount)}
              </span>{" "}
              románů, klasiky, poezie i divadla – všechno, co má od čtenářů
              aspoň čtyři hvězdičky. A hlavně zdarma ke stažení z městské
              knihovny.
            </p>
          </div>
        </section>

        {/* Genre sections */}
        <div className="space-y-8">
          {genres.map(({ genre, books, bookCount }) => (
            <GenreSection
              key={genre}
              books={books}
              genreKey={genre}
              bookCount={bookCount}
            />
          ))}
        </div>

        {/* Fallback if no books */}
        {bookCount === 0 && (
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
