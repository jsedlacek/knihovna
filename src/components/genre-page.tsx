import { useCallback, useState } from "react";
import { BookCard } from "#@/components/book-card.tsx";
import { Button } from "#@/components/ui/button.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";
import { getGenreBooks } from "#@/routes/$genre.tsx";

interface GenrePageProps {
  initialBooks: Book[];
  totalCount: number;
  initialNextCursor: number | null;
  genreKey: keyof typeof GENRE_GROUPS;
  showScores?: boolean;
}

export function GenrePage({
  initialBooks,
  totalCount,
  initialNextCursor,
  genreKey,
  showScores = false,
}: GenrePageProps) {
  const genreConfig = GENRE_GROUPS[genreKey];
  const [books, setBooks] = useState(initialBooks);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (nextCursor === null || loading) return;
    setLoading(true);
    try {
      const result = await getGenreBooks({ data: { genre: genreKey, cursor: nextCursor } });
      setBooks((prev) => [...prev, ...result.books]);
      setNextCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, genreKey]);

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
      <Header breadcrumbs={[{ label: "Domů", href: "/" }, { label: genreConfig.name }]} />

      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">{genreConfig.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {genreConfig.description} ({formatNumberCzech(totalCount)}{" "}
              {totalCount === 1 ? "kniha" : totalCount < 5 ? "knihy" : "knih"})
            </p>
          </div>
        </section>
        <section className="space-y-4">
          <div className="divide-y-4 divide-double divide-border sm:divide-y-0 sm:space-y-8">
            {books.length > 0 ? (
              books.map((book, index) => (
                <div
                  key={`${genreKey}-${book.titulKey}`}
                  className="py-6 first:pt-0 last:pb-0 sm:py-0"
                >
                  <BookCard book={book} index={index} showScores={showScores} />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                V této kategorii nejsou momentálně k dispozici žádné knihy.
              </p>
            )}
          </div>
          {nextCursor !== null && (
            <div className="flex pt-4">
              <Button onClick={loadMore} disabled={loading}>
                {loading
                  ? "Načítání…"
                  : `Načíst další (${formatNumberCzech(totalCount - books.length)} zbývá)`}
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
