import { useCallback, useState } from "react";
import { BookGrid } from "#@/components/book-grid.tsx";
import { getButtonClasses } from "#@/components/ui/button.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import {
  NoScriptPageIndicator,
  NoScriptPagination,
} from "#@/components/ui/noscript-pagination.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

export interface LoadMoreResult {
  books: Book[];
  nextCursor: number | null;
}

interface GenrePageProps {
  initialBooks: Book[];
  totalCount: number;
  initialNextCursor: number | null;
  genreKey: keyof typeof GENRE_GROUPS;
  lastUpdated?: string;
  currentPage?: number;
  totalPages?: number;
  onLoadMore?: (genre: string, cursor: number) => Promise<LoadMoreResult>;
}

export function GenrePage({
  initialBooks,
  totalCount,
  initialNextCursor,
  genreKey,
  lastUpdated,
  currentPage = 1,
  totalPages = 1,
  onLoadMore,
}: GenrePageProps) {
  const genreConfig = GENRE_GROUPS[genreKey];
  const [books, setBooks] = useState(initialBooks);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(currentPage);

  const loadMore = useCallback(async () => {
    if (nextCursor === null || loading || !onLoadMore) return;
    setLoading(true);
    try {
      const result = await onLoadMore(genreKey, nextCursor);
      setBooks((prev) => [...prev, ...result.books]);
      setNextCursor(result.nextCursor);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, genreKey, onLoadMore]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: genreConfig.name,
    description: genreConfig.metaDescription,
    url: `https://knihovna.jakub.contact/${genreKey}`,
    inLanguage: "cs",
    numberOfItems: totalCount,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{genreConfig.name}</h2>
            <p className="text-base text-muted-foreground mt-1">
              {genreConfig.description} ({formatNumberCzech(totalCount)}{" "}
              {totalCount === 1 ? "kniha" : totalCount < 5 ? "knihy" : "knih"})
            </p>
          </div>
          <NoScriptPageIndicator currentPage={currentPage} totalPages={totalPages} />
        </section>
        <section className="space-y-4">
          {books.length > 0 ? (
            <BookGrid books={books} keyPrefix={`${genreKey}-`} />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              V této kategorii nejsou momentálně k dispozici žádné knihy.
            </p>
          )}
          <NoScriptPagination currentPage={currentPage} totalPages={totalPages} />
          {nextCursor !== null ? (
            <div className="flex justify-center pt-8">
              <a
                href={`?strana=${String(page + 1)}`}
                className={getButtonClasses(
                  "primary",
                  loading ? "opacity-50 pointer-events-none" : undefined,
                )}
                onClick={(e) => {
                  e.preventDefault();
                  loadMore();
                }}
              >
                {loading
                  ? "Načítání…"
                  : `Načíst další (${formatNumberCzech(totalCount - nextCursor)} zbývá)`}
              </a>
            </div>
          ) : (
            books.length > 0 && <p className="text-center text-muted-foreground pt-8 text-4xl">❧</p>
          )}
        </section>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
