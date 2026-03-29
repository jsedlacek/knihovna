import { useCallback, useState } from "react";
import { BookGrid } from "#@/components/book-grid.tsx";
import { Button } from "#@/components/ui/button.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Author, Book } from "#@/lib/shared/types/book-types.ts";
import { formatAuthorName, formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

export interface AuthorLoadMoreResult {
  books: Book[];
  nextCursor: number | null;
}

interface AuthorPageProps {
  author: Author;
  initialBooks: Book[];
  totalCount: number;
  initialNextCursor: number | null;
  lastUpdated?: string;
  onLoadMore?: (authorSlug: string, cursor: number) => Promise<AuthorLoadMoreResult>;
}

export function AuthorPage({
  author,
  initialBooks,
  totalCount,
  initialNextCursor,
  lastUpdated,
  onLoadMore,
}: AuthorPageProps) {
  const [books, setBooks] = useState(initialBooks);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);

  const displayName = formatAuthorName(author.name);

  const loadMore = useCallback(async () => {
    if (nextCursor === null || loading || !onLoadMore) return;
    setLoading(true);
    try {
      const result = await onLoadMore(author.slug, nextCursor);
      setBooks((prev) => [...prev, ...result.books]);
      setNextCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, author.slug, onLoadMore]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    ...(author.description && { description: author.description }),
    ...(author.imageUrl && { image: author.imageUrl }),
    url: `https://knihovna.jakub.contact/autor/${author.slug}`,
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
          <div className="flex items-start gap-4 sm:gap-6">
            {author.imageUrl && (
              <img
                src={author.imageUrl}
                alt={displayName}
                className="w-24 sm:w-32 rounded-full object-cover aspect-square"
                {...(author.imageWidth && author.imageHeight
                  ? { width: author.imageWidth, height: author.imageHeight }
                  : {})}
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{displayName}</h2>
              {author.born && <p className="text-sm text-muted-foreground mt-1">{author.born}</p>}
              {author.description && (
                <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                  {author.description}
                </p>
              )}
            </div>
          </div>
          <p className="text-base text-muted-foreground">
            {formatNumberCzech(totalCount)}{" "}
            {totalCount === 1 ? "kniha" : totalCount < 5 ? "knihy" : "knih"}
          </p>
        </section>
        <section className="space-y-4">
          {books.length > 0 ? (
            <BookGrid books={books} keyPrefix={`author-${author.slug}-`} />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Žádné knihy tohoto autora nejsou momentálně k dispozici.
            </p>
          )}
          {nextCursor !== null ? (
            <div className="flex justify-center pt-8">
              <Button onClick={loadMore} disabled={loading}>
                {loading
                  ? "Načítání…"
                  : `Načíst další (${formatNumberCzech(totalCount - books.length)} zbývá)`}
              </Button>
            </div>
          ) : (
            books.length > 0 && (
              <p className="text-center text-muted-foreground pt-8 text-4xl opacity-40">❧</p>
            )
          )}
        </section>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
