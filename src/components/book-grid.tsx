import type { Book } from "#@/lib/shared/types/book-types.ts";
import { BookCardMini } from "./book-card-mini.tsx";

const DEFAULT_ASPECT_RATIO = 0.67; // typical book cover (2:3)
const ITEMS_PER_ROW = 4;

interface BookGridProps {
  books: Book[];
  keyPrefix?: string;
}

export function BookGrid({ books, keyPrefix = "" }: BookGridProps) {
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += ITEMS_PER_ROW) {
    rows.push(books.slice(i, i + ITEMS_PER_ROW));
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-2 sm:flex gap-4 sm:gap-6">
          {row.map((book) => {
            const aspectRatio =
              book.imageWidth && book.imageHeight
                ? book.imageWidth / book.imageHeight
                : DEFAULT_ASPECT_RATIO;

            return (
              <div
                key={`${keyPrefix}${book.titulKey}`}
                className="min-w-0 sm:basis-0"
                style={{ flexGrow: aspectRatio }}
              >
                <BookCardMini book={book} />
              </div>
            );
          })}
          {row.length < ITEMS_PER_ROW &&
            Array.from({ length: ITEMS_PER_ROW - row.length }, (_, i) => (
              <div
                key={`spacer-${i}`}
                className="hidden sm:block sm:basis-0"
                style={{ flexGrow: DEFAULT_ASPECT_RATIO }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
