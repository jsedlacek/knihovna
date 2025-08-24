import { StarIcon } from "lucide-react";
import placeholderCover from "#@/images/book-placeholder.svg";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatBookScore } from "#@/lib/shared/utils/book-scoring.ts";
import {
  formatAuthorName,
  formatNumberCompact,
  formatNumberCzech,
} from "#@/lib/shared/utils/text-utils.ts";

interface BookCardProps {
  book: Book;
  index: number;
  showScores?: boolean;
}

export function BookCard({ book, index, showScores = false }: BookCardProps) {
  return (
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
          src={book.imageUrl || placeholderCover}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== placeholderCover) img.src = placeholderCover;
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
                    <a
                      href={book.url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatNumberCompact(book.ratingsCount)}
                      &nbsp;hodnocení
                    </a>
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
            <span className="text-orange-600 font-bold">
              <span className="mx-2">|</span>Skóre: {formatBookScore(book)}
            </span>
          )}
        </div>
        <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
          {book.epubUrl && (
            <a
              href={book.epubUrl}
              className="bg-gray-200 text-gray-900 px-4 py-2 sm:px-3 sm:py-1 text-xs font-mono border-1 border-gray-400 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 min-h-[44px] sm:min-h-0 shadow-[1px_1px_0px_0px_rgb(107,114,128)] uppercase tracking-wide flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              STÁHNOUT EPUB
            </a>
          )}
          {book.pdfUrl && (
            <a
              href={book.pdfUrl}
              className="bg-gray-100 text-gray-600 px-4 py-2 sm:px-3 sm:py-1 text-xs font-mono border-1 border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 min-h-[44px] sm:min-h-0 shadow-[1px_1px_0px_0px_rgb(156,163,175)] uppercase tracking-wide flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              ZOBRAZIT PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
