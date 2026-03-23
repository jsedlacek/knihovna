import { ExternalLinkIcon, StarIcon } from "lucide-react";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import {
  formatAuthorName,
  formatNumberCompact,
  formatNumberCzech,
} from "#@/lib/shared/utils/text-utils.ts";
import { getGenreGroupKey, getGenreName, GENRE_GROUPS } from "#@/lib/shared/utils/genre-utils.ts";
import { BookCover } from "./ui/book-cover.tsx";
import { Button } from "./ui/button.tsx";
import { Footer } from "./ui/footer.tsx";
import { Header } from "./ui/header.tsx";
import { Link } from "./ui/link.tsx";

interface BookDetailPageProps {
  book: Book;
}

export function BookDetailPage({ book }: BookDetailPageProps) {
  const authorName = formatAuthorName(book.author);
  const fullTitle =
    book.partTitle || book.subtitle
      ? `${book.title} (${book.partTitle || book.subtitle})`
      : book.title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    ...(book.description && { description: book.description }),
    ...(book.imageUrl && { image: book.imageUrl }),
    ...(book.publisher && { publisher: book.publisher }),
    ...(book.year && { datePublished: String(book.year) }),
    ...(book.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: book.rating,
        ratingCount: book.ratingsCount,
        bestRating: 5,
      },
    }),
    inLanguage: "cs",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header
        breadcrumbs={[
          { label: "Domů", href: "/" },
          {
            label: GENRE_GROUPS[getGenreGroupKey(book.genreId)].name,
            href: `/${getGenreGroupKey(book.genreId)}`,
          },
          { label: book.title },
        ]}
      />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <article className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <BookCover
            src={book.imageUrl}
            alt={`${book.title} book cover`}
            className="w-32 h-48 sm:w-40 sm:h-60"
          />
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h2 className="text-lg font-bold">
                {authorName} – {fullTitle}
              </h2>
              {book.genre && (
                <div className="text-xs text-muted-foreground mt-1">
                  {getGenreName(book.genreId)}
                </div>
              )}
              {(book.publisher || book.year) && (
                <div className="text-xs text-muted-foreground mt-1">
                  {[book.publisher, book.year].filter(Boolean).join(", ")}
                </div>
              )}
            </div>

            {book.rating && (
              <div className="flex items-center justify-center sm:justify-start text-sm">
                <span className="font-semibold">
                  {formatNumberCzech(Math.round(book.rating * 10) / 10)}
                </span>
                <StarIcon className="ml-1 size-3 fill-current mr-2" />
                {book.ratingsCount && (
                  <span className="text-muted-foreground">
                    (
                    {book.url ? (
                      <Link href={book.url} className="underline">
                        {formatNumberCompact(book.ratingsCount)} hodnocení
                      </Link>
                    ) : (
                      <span>{formatNumberCompact(book.ratingsCount)} hodnocení</span>
                    )}
                    )
                  </span>
                )}
              </div>
            )}

            {book.description && <p className="text-sm text-card-foreground">{book.description}</p>}

            <div className="flex justify-center sm:justify-start gap-2 flex-wrap pt-2">
              {book.epubUrl && (
                <Button href={book.epubUrl} variant="primary" rel="noopener noreferrer">
                  STÁHNOUT EPUB
                </Button>
              )}
              {book.pdfUrl && (
                <Button
                  href={book.pdfUrl}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ZOBRAZIT PDF
                </Button>
              )}
              <Button
                href={book.detailUrl}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                MĚSTSKÁ KNIHOVNA <ExternalLinkIcon className="ml-1 size-3" />
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
