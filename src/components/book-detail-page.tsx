import { DownloadIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatAuthorName } from "#@/lib/shared/utils/text-utils.ts";
import { getGenreName } from "#@/lib/shared/utils/genre-utils.ts";
import { BookRating } from "./book-rating.tsx";
import { CoverImage } from "./ui/cover-image.tsx";
import { Button } from "./ui/button.tsx";
import { Footer } from "./ui/footer.tsx";
import { Header } from "./ui/header.tsx";
import { Link } from "./ui/link.tsx";

interface BookDetailPageProps {
  book: Book;
  lastUpdated?: string;
}

export function BookDetailPage({ book, lastUpdated }: BookDetailPageProps) {
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <article className="space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <CoverImage
              src={book.imageUrl}
              alt={`${book.title} book cover`}
              className="w-32 sm:w-40"
              width={160}
              {...(book.imageWidth && book.imageHeight
                ? { aspectRatio: book.imageWidth / book.imageHeight }
                : {})}
            />
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold mb-1">{fullTitle}</h2>
                <p className="text-lg text-muted-foreground">{authorName}</p>
                {book.genre && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {getGenreName(book.genreId)}
                  </div>
                )}
                {(book.publisher || book.year) && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {[book.publisher, book.year].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>

              {book.rating && (
                <BookRating
                  rating={book.rating}
                  ratingsCount={book.ratingsCount}
                  url={book.url}
                  size="base"
                />
              )}

              <div className="flex gap-2 flex-wrap">
                {book.epubUrl && (
                  <Button href={book.epubUrl} variant="primary" rel="noopener noreferrer">
                    <DownloadIcon className="mr-1.5 size-3.5" />
                    Stáhnout EPUB
                  </Button>
                )}
                {book.pdfUrl && (
                  <Button
                    href={book.pdfUrl}
                    variant="secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileTextIcon className="mr-1.5 size-3.5" />
                    Zobrazit PDF
                  </Button>
                )}
              </div>

              {book.description && (
                <p className="text-base text-card-foreground leading-relaxed">{book.description}</p>
              )}

              <Link href={book.detailUrl} className="inline-flex items-center text-base">
                Zobrazit v Městské knihovně
                <ExternalLinkIcon className="ml-1 size-3" />
              </Link>
            </div>
          </div>
        </article>
        <p className="text-center text-muted-foreground pt-8 text-2xl">❧</p>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
