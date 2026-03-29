import { GenreSection } from "#@/components/genre-section.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { type GenreGroup } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

export interface BookGenre {
  genre: GenreGroup;
  books: Book[];
  bookCount: number;
}

interface HomePageProps {
  bookCount: number;
  genres: BookGenre[];
  lastUpdated?: string;
}

export function HomePage({ bookCount, genres, lastUpdated }: HomePageProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nejlepší e-knihy zdarma",
    url: "https://knihovna.jakub.contact",
    description:
      "Nejlepší české e-knihy zdarma z městské knihovny. Moderní romány, klasika, poezie i divadelní hry s hodnocením 4,0 a vyšším.",
    inLanguage: "cs",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      {/* Main content */}
      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <section className="space-y-4">
          <div className="text-base leading-relaxed space-y-4">
            <p>
              Vítej v knihovně! Tady najdeš{" "}
              <span className="font-semibold">{formatNumberCzech(bookCount)}</span> románů, básní a
              divadelních her – všechno, co má od čtenářů aspoň{" "}
              <span className="font-semibold">čtyři hvězdičky</span>. A hlavně,{" "}
              <span className="font-semibold">zdarma ke stažení</span>.
            </p>
          </div>
          <p className="text-center text-muted-foreground text-4xl opacity-40">❦</p>
        </section>

        {/* Genre sections */}
        <div className="space-y-12">
          {genres.map(({ genre, books, bookCount }) => (
            <GenreSection key={genre} books={books} genreKey={genre} bookCount={bookCount} />
          ))}
        </div>

        {/* Fallback if no books */}
        {bookCount === 0 ? (
          <section className="space-y-4">
            <p className="text-muted-foreground">
              Žádné knihy nejsou momentálně k dispozici. Zkontrolujte soubor data/books.json.
            </p>
          </section>
        ) : (
          <p className="text-center text-muted-foreground pt-8 text-4xl opacity-40">❧</p>
        )}
      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
