import { DownloadIcon, FileTextIcon } from "lucide-react";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatAuthorName } from "#@/lib/shared/utils/text-utils.ts";
import { getBookDetailPath } from "#@/lib/shared/utils/book-url-utils.ts";
import { BookRating } from "./book-rating.tsx";
import { CoverImage } from "./ui/cover-image.tsx";
import { Button } from "./ui/button.tsx";
import { Link } from "./ui/link.tsx";

interface BookCardProps {
  book: Book;
  index: number;
}

export function BookCard({ book, index }: BookCardProps) {
  return (
    <article
      key={`${book.title}-${book.author}-${index}`}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4"
    >
      <CoverImage
        src={book.imageUrl}
        alt={`${book.title} book cover`}
        href={getBookDetailPath(book)}
        external={false}
        className="w-28 sm:w-36"
        width={144}
        {...(book.imageWidth && book.imageHeight
          ? { aspectRatio: book.imageWidth / book.imageHeight }
          : {})}
      />
      <div className="flex-1">
        <h3 className="font-bold text-base mb-0.5">
          <Link href={getBookDetailPath(book)} external={false}>
            {book.title}
            {(book.partTitle || book.subtitle) && ` (${book.partTitle || book.subtitle})`}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{formatAuthorName(book.author)}</p>
        <p
          className="text-base text-card-foreground mb-2 leading-relaxed line-clamp-3"
          title={book.description ?? undefined}
        >
          {book.description}
        </p>
        <div className="mb-3">
          <BookRating rating={book.rating} ratingsCount={book.ratingsCount} url={book.url} />
        </div>
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
      </div>
    </article>
  );
}
