import {
  sortBooksByScore,
  formatBookScore,
} from "#@/lib/shared/utils/book-scoring.ts";
import {
  formatNumberCzech,
  formatAuthorName,
} from "#@/lib/shared/utils/text-utils.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { filterBlockedBooks } from "#@/lib/shared/config/book-block-list.ts";
import placeholderCover from "#@/images/book-placeholder.svg";

interface TimestampData {
  lastUpdated: string;
  timestamp: number;
}

interface HomePageProps {
  books: Book[];
  lastUpdated?: TimestampData | null;
}

export default function HomePage({ books, lastUpdated }: HomePageProps) {
  // First filter out blocked books
  const unblockedBooks = filterBlockedBooks(books);

  // Then filter books with a rating of 4.0 or higher and have EPUB download links
  const filteredBooks = unblockedBooks.filter(
    (book) => book.rating !== null && book.rating >= 4.0 && book.epubUrl,
  );

  // Sort all books by score
  const sortedBooks = sortBooksByScore(filteredBooks);

  // Enable score display for debugging (set to true to show scores)
  const showScores = false;

  // Format the last updated timestamp
  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated.lastUpdated).toLocaleDateString("cs-CZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-lg font-bold mb-2">Nejlepší e-knihy zdarma</h1>
          {lastUpdated && (
            <div className="text-sm text-muted-foreground">
              Aktualizováno {formattedLastUpdated}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <section className="space-y-4">
          <div className="text-sm leading-relaxed space-y-4">
            <p>
              Tady najdete romány, klasiku, poezii i divadlo – všechno, co má od
              čtenářů aspoň čtyři hvězdičky. A hlavně zdarma ke stažení z
              městské knihovny.
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
                <a
                  href={book.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <img
                    src={book.imageUrl || placeholderCover.src}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== placeholderCover.src)
                        img.src = placeholderCover.src;
                    }}
                    alt={`${book.title} book cover`}
                    className="w-20 h-30 object-cover border border-border hover:opacity-80 transition-opacity"
                  />
                </a>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2">
                    <a
                      href={book.detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {formatAuthorName(book.author)} – {book.title}
                      {book.partTitle && ` (${book.partTitle})`}
                    </a>
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
                    {book.year && `${" | "}Rok: ${book.year}`}
                    {book.genres &&
                      book.genres.length > 0 &&
                      ` | Žánr: ${book.genres.join(", ")}`}
                  </div>
                  <div className="flex gap-2">
                    {book.epubUrl && (
                      <a
                        href={book.epubUrl}
                        className="bg-primary text-primary-foreground px-3 py-1 text-xs font-mono border border-border hover:bg-primary/90 inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        STÁHNOUT EPUB
                      </a>
                    )}
                    {book.pdfUrl && (
                      <a
                        href={book.pdfUrl}
                        className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-mono border border-border hover:bg-secondary/90 inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ZOBRAZIT PDF
                      </a>
                    )}
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
