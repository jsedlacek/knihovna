import {
  sortBooksByScore,
  formatBookScore,
} from "#@/lib/shared/utils/book-scoring.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

interface HomePageProps {
  books: Book[];
}

export default function HomePage({ books }: HomePageProps) {
  // Filter books with a rating of 4.0 or higher
  const filteredBooks = books.filter(
    (book) => book.rating !== null && book.rating >= 4.0,
  );

  // Sort all books by score
  const sortedBooks = sortBooksByScore(filteredBooks);

  // Enable score display for debugging (set to true to show scores)
  const showScores = false;

  // Placeholder cover for missing/broken images (inline SVG)
  const placeholderCover =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="240" viewBox="0 0 160 240"><rect width="160" height="240" rx="10" fill="%23e5e7eb"/><rect x="8" y="8" width="144" height="224" rx="8" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="2"/><g transform="translate(40,68)"><rect x="0" y="0" width="80" height="104" rx="6" fill="%23fff" stroke="%23d1d5db" stroke-width="2"/><rect x="8" y="0" width="8" height="104" rx="4" fill="%23f3f4f6"/><rect x="22" y="18" width="48" height="10" rx="2" fill="%23e5e7eb"/><rect x="22" y="36" width="40" height="8" rx="2" fill="%23eef2f7"/><rect x="22" y="50" width="44" height="8" rx="2" fill="%23eef2f7"/><rect x="22" y="64" width="36" height="8" rx="2" fill="%23eef2f7"/><rect x="22" y="84" width="32" height="6" rx="2" fill="%23e5e7eb"/></g></svg>';

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-lg font-bold mb-2">Nejlepší e-knihy zdarma</h1>
          <div className="text-sm text-muted-foreground">
            Aktualizováno:{" "}
            {new Date().toLocaleDateString("cs-CZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <section className="space-y-4">
          <div className="text-sm leading-relaxed space-y-4">
            <p>
              Tady najdete moderní romány, klasiku, poezii i divadlo – všechno,
              co má od čtenářů aspoň čtyři hvězdičky. A hlavně zdarma ke stažení
              z městské knihovny.
            </p>
          </div>
        </section>

        {/* All books sorted by score */}
        <section className="space-y-4">
          <div className="space-y-4">
            {sortedBooks.map((book, index) => (
              <div
                key={`${book.title}-${book.author}-${index}`}
                className="bg-card p-4 border border-border flex gap-4"
              >
                <img
                  src={book.imageUrl || placeholderCover}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== placeholderCover)
                      img.src = placeholderCover;
                  }}
                  alt={`${book.title} book cover`}
                  className="w-20 h-30 object-cover border border-border flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2">
                    {book.author} – {book.title}
                    {book.partTitle && ` (${book.partTitle})`}
                  </h3>
                  <p className="text-sm text-card-foreground mb-2 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    {book.rating ? (
                      <>
                        {book.rating}/5
                        {book.ratingsCount && (
                          <>
                            {" "}
                            (
                            {book.url ? (
                              <a
                                href={book.url}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {formatNumberCzech(book.ratingsCount)} hodnocení
                              </a>
                            ) : (
                              <span>
                                {formatNumberCzech(book.ratingsCount)} hodnocení
                              </span>
                            )}
                            )
                          </>
                        )}
                      </>
                    ) : (
                      "Bez hodnocení"
                    )}
                    {showScores && book.rating && (
                      <span className="text-orange-600 font-bold">
                        {" | "}Skóre: {formatBookScore(book)}
                      </span>
                    )}
                    {" | "}Rok: {book.year}
                    {book.genres &&
                      book.genres.length > 0 &&
                      ` | Žánr: ${book.genres.join(", ")}`}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={book.epubUrl}
                      className="bg-primary text-primary-foreground px-3 py-1 text-xs font-mono border border-border hover:bg-primary/90 inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      STÁHNOUT EPUB
                    </a>
                    <a
                      href={book.pdfUrl}
                      className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-mono border border-border hover:bg-secondary/90 inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ZOBRAZIT PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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

      <footer className="border-t border-border mt-12 p-6">
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
              Jakub Sedlacek
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
