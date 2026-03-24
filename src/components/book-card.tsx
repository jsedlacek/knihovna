import { StarIcon } from "lucide-react";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatBookScore } from "#@/lib/shared/utils/book-scoring.ts";
import {
  formatAuthorName,
  formatNumberCompact,
  formatNumberCzech,
} from "#@/lib/shared/utils/text-utils.ts";
import { getBookDetailPath } from "#@/lib/shared/utils/book-url-utils.ts";
import { BookCover } from "./ui/book-cover.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "./ui/link.tsx";

interface BookCardProps {
  book: Book;
  index: number;
  showScores?: boolean;
}

export function BookCard({ book, index, showScores = false }: BookCardProps) {
  return (
    <article
      key={`${book.title}-${book.author}-${index}`}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4"
    >
      <BookCover
        src={book.imageUrl}
        alt={`${book.title} book cover`}
        href={getBookDetailPath(book)}
        external={false}
        width={80}
        height={120}
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-bold text-sm mb-2">
          <a href={getBookDetailPath(book)} className="text-link hover:underline">
            {formatAuthorName(book.author)} – {book.title}
            {(book.partTitle || book.subtitle) && ` (${book.partTitle || book.subtitle})`}
          </a>
        </h3>
        <p className="text-sm text-card-foreground mb-2 line-clamp-3">{book.description}</p>
        <div className="text-xs text-muted-foreground mb-3">
          {book.rating ? (
            <div className="flex items-center justify-center sm:justify-start">
              <span className="inline-flex items-center">
                <span className="font-semibold">
                  {formatNumberCzech(Math.round(book.rating * 10) / 10)}
                </span>
                <StarIcon className="ml-1 size-2.5 fill-current mr-2" />
              </span>

              <span>
                (
                {book.ratingsCount &&
                  (book.url ? (
                    <Link href={book.url} className="underline">
                      {formatNumberCompact(book.ratingsCount)}
                      &nbsp;hodnocení
                    </Link>
                  ) : (
                    <span>
                      {formatNumberCompact(book.ratingsCount)}
                      &nbsp;hodnocení
                    </span>
                  ))}
                )
              </span>
            </div>
          ) : (
            "Bez hodnocení"
          )}
          {showScores && book.rating && (
            <span className="font-bold">
              <span className="mx-2">|</span>Skóre: {formatBookScore(book)}
            </span>
          )}
        </div>
        <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
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
        </div>
      </div>
    </article>
  );
}
