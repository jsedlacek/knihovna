import { create, insertMultiple, search } from "@orama/orama";

import type { Book } from "#@/lib/shared/types/book-types.ts";
import { formatAuthorName } from "#@/lib/shared/utils/text-utils.ts";

export const MIN_SEARCH_LENGTH = 2;

export async function searchBooks(books: Book[], query: string): Promise<Book[]> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_SEARCH_LENGTH) return [];

  const db = create({
    schema: {
      title: "string",
      author: "string",
      bookIndex: "number",
    },
  });

  await insertMultiple(
    db,
    books.map((b, i) => ({
      title: b.title,
      author: formatAuthorName(b.author),
      bookIndex: i,
    })),
  );

  const results = await search(db, {
    term: trimmed,
    properties: ["title", "author"],
    boost: { title: 2 },
    tolerance: 1,
  });

  return results.hits.map((hit) => books[hit.document.bookIndex]!);
}
