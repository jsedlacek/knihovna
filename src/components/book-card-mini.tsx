import type { Book } from "#@/lib/shared/types/book-types.ts";
import { getBookDetailPath } from "#@/lib/shared/utils/book-url-utils.ts";
import { BookRating } from "./book-rating.tsx";
import { CoverImage } from "./ui/cover-image.tsx";
import { Link } from "./ui/link.tsx";

const DEFAULT_ASPECT_RATIO = 0.67; // typical book cover (2:3)

interface BookCardMiniProps {
  book: Book;
}

export function BookCardMini({ book }: BookCardMiniProps) {
  const aspectRatio =
    book.imageWidth && book.imageHeight ? book.imageWidth / book.imageHeight : DEFAULT_ASPECT_RATIO;

  return (
    <>
      <CoverImage
        src={book.imageUrl}
        alt={`${book.title} cover`}
        href={getBookDetailPath(book)}
        external={false}
        className="w-full mb-2"
        width={300}
        aspectRatio={aspectRatio}
      />
      <Link
        href={getBookDetailPath(book)}
        external={false}
        title={book.title}
        className="text-base font-medium leading-snug line-clamp-2"
      >
        {book.title}
      </Link>
      <p className="text-sm text-muted-foreground leading-snug truncate" title={book.author}>
        {book.author}
      </p>
      <BookRating rating={book.rating} />
    </>
  );
}
