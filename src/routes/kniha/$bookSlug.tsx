import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BookDetailPage } from "#@/components/book-detail-page.tsx";
import { getBooks } from "#@/lib/server/books.ts";
import { errorLogging } from "#@/lib/server/utils/server-fn.ts";
import { parseTitulKeyFromSlug } from "#@/lib/shared/utils/book-url-utils.ts";
import { formatAuthorName } from "#@/lib/shared/utils/text-utils.ts";

const getBookBySlug = createServerFn({
  method: "GET",
})
  .middleware([errorLogging])
  .inputValidator((d: string): number => {
    const titulKey = parseTitulKeyFromSlug(d);
    if (titulKey === null) {
      throw new Error(`Invalid book slug: ${d}`);
    }
    return titulKey;
  })
  .handler(async ({ data: titulKey }) => {
    const books = await getBooks();
    const book = books.find((b) => b.titulKey === titulKey);
    if (!book) {
      throw new Error(`Book not found: ${titulKey}`);
    }
    return book;
  });

export const Route = createFileRoute("/kniha/$bookSlug")({
  loader: async ({ params }) => {
    try {
      return await getBookBySlug({ data: params.bookSlug });
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData: book, params }) => {
    if (!book) return {};

    const title = `${formatAuthorName(book.author)} – ${book.title}`;
    const description =
      book.description || `E-kniha ${book.title} od ${book.author} ke stažení zdarma.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(book.imageUrl ? [{ property: "og:image", content: book.imageUrl }] : []),
        {
          property: "og:url",
          content: `https://knihovna.jakub.contact/kniha/${params.bookSlug}`,
        },
      ],
    };
  },
  component: BookDetailComponent,
});

function BookDetailComponent() {
  const book = Route.useLoaderData();
  return <BookDetailPage book={book} />;
}
