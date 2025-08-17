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
import { deduplicateBooks } from "#@/lib/shared/utils/book-deduplication.ts";
import placeholderCover from "#@/images/book-placeholder.svg";
import { StarIcon } from "lucide-react";

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
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <h1 className="text-lg font-bold mb-2">Nejlepší e-knihy zdarma</h1>
          {lastUpdated && (
            <div className="text-sm text-muted-foreground">
              Aktualizováno {formattedLastUpdated}
            </div>
          )}
        </div>
      </header>

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

        {/* All books sorted by score */}
        <section className="space-y-4">
          <div className="space-y-4">
            {sortedBooks.map((book, index) => (
              <div
                key={`${book.title}-${book.author}-${index}`}
                className="bg-card p-3 sm:p-4 border border-border flex flex-col sm:flex-row gap-3 sm:gap-4"
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
                    className="w-16 h-24 sm:w-20 sm:h-30 object-cover border border-border hover:opacity-80 transition-opacity mx-auto sm:mx-0"
                  />
                </a>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-sm mb-2">
                    <a
                      href={book.detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {formatAuthorName(book.author)} – {book.title}
                      {(book.partTitle || book.subtitle) &&
                        ` (${book.partTitle || book.subtitle})`}
                    </a>
                  </h3>
                  <p className="text-sm text-card-foreground mb-2 line-clamp-3">
                    {book.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    {book.rating ? (
                      <div className="flex items-center justify-center sm:justify-start">
                        <span className="font-semibold">
                          {formatNumberCzech(Math.round(book.rating * 10) / 10)}
                        </span>
                        <StarIcon className="ml-1 size-3 fill-current mr-2" />
                        {book.ratingsCount && (
                          <>
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
                      </div>
                    ) : (
                      "Bez hodnocení"
                    )}
                    {showScores && book.rating && (
                      <span className="text-orange-600 font-bold">
                        <span className="mx-2">|</span>Skóre:{" "}
                        {formatBookScore(book)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                    {book.epubUrl && (
                      <a
                        href={book.epubUrl}
                        className="bg-gray-200 text-gray-900 px-4 py-2 sm:px-3 sm:py-1 text-xs font-mono border-1 border-gray-400 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 min-h-[44px] sm:min-h-0 shadow-[1px_1px_0px_0px_rgb(107,114,128)] uppercase tracking-wide flex self-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        STÁHNOUT EPUB
                      </a>
                    )}
                    {book.pdfUrl && (
                      <a
                        href={book.pdfUrl}
                        className="bg-gray-100 text-gray-600 px-4 py-2 sm:px-3 sm:py-1 text-xs font-mono border-1 border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 min-h-[44px] sm:min-h-0 shadow-[1px_1px_0px_0px_rgb(156,163,175)] uppercase tracking-wide flex self-center"
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
              Jakub Sedlacek
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
