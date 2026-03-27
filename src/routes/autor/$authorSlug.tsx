import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AuthorPage } from "#@/components/author-page.tsx";
import { getAuthors, getBooks } from "#@/lib/server/books.ts";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { errorLogging } from "#@/lib/server/utils/server-fn.ts";
import type { Author, Book } from "#@/lib/shared/types/book-types.ts";
import { getAuthorSlug } from "#@/lib/shared/utils/book-url-utils.ts";
import { formatAuthorName } from "#@/lib/shared/utils/text-utils.ts";

const log = createLogger("route.author");

const PAGE_SIZE = 20;

export type AuthorBooksResult = {
  author: Author;
  books: Book[];
  totalCount: number;
  nextCursor: number | null;
};

export const getAuthorBooks = createServerFn({
  method: "GET",
})
  .middleware([errorLogging])
  .inputValidator(
    (d: { authorSlug: string; cursor?: number }): { authorSlug: string; cursor: number } => {
      return { authorSlug: d.authorSlug, cursor: d.cursor ?? 0 };
    },
  )
  .handler(async ({ data: { authorSlug, cursor } }): Promise<AuthorBooksResult> => {
    const totalStart = performance.now();

    const [authors, books] = await Promise.all([getAuthors(), getBooks()]);

    const author = authors.find((a) => a.slug === authorSlug);
    if (!author) {
      throw notFound();
    }

    const authorBooks = books.filter((b) => getAuthorSlug(b.author) === authorSlug);
    log.info("Author handler", {
      authorSlug,
      duration: performance.now() - totalStart,
      count: authorBooks.length,
    });

    const page = authorBooks.slice(cursor, cursor + PAGE_SIZE);
    const nextCursor = cursor + PAGE_SIZE < authorBooks.length ? cursor + PAGE_SIZE : null;

    return { author, books: page, totalCount: authorBooks.length, nextCursor };
  });

export const Route = createFileRoute("/autor/$authorSlug")({
  loader: async ({ params }) => {
    return getAuthorBooks({ data: { authorSlug: params.authorSlug, cursor: 0 } });
  },
  head: ({ loaderData }) => {
    if (!loaderData?.author) {
      return {};
    }

    const displayName = formatAuthorName(loaderData.author.name);

    return {
      meta: [
        { title: `${displayName} — Knihovna` },
        {
          name: "description",
          content: loaderData.author.description
            ? `${displayName}: ${loaderData.author.description.slice(0, 150)}`
            : `Knihy autora ${displayName} ke stažení zdarma.`,
        },
        { property: "og:title", content: `${displayName} — Knihovna` },
        {
          property: "og:description",
          content: `Knihy autora ${displayName} ke stažení zdarma z Městské knihovny v Praze.`,
        },
        {
          property: "og:url",
          content: `https://knihovna.jakub.contact/autor/${loaderData.author.slug}`,
        },
        ...(loaderData.author.imageUrl
          ? [{ property: "og:image", content: loaderData.author.imageUrl }]
          : []),
      ],
    };
  },
  component: AuthorComponent,
});

const rootRouteApi = getRouteApi("__root__");

function AuthorComponent() {
  const { author, books, totalCount, nextCursor } = Route.useLoaderData();
  const { lastUpdated } = rootRouteApi.useLoaderData();

  return (
    <AuthorPage
      author={author}
      initialBooks={books}
      totalCount={totalCount}
      initialNextCursor={nextCursor}
      lastUpdated={lastUpdated}
      onLoadMore={async (slug, cursor) => {
        const result = await getAuthorBooks({ data: { authorSlug: slug, cursor } });
        return { books: result.books, nextCursor: result.nextCursor };
      }}
    />
  );
}
