import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SearchPage } from "#@/components/search-page.tsx";
import { getBooks } from "#@/lib/server/books.ts";
import { errorLogging } from "#@/lib/server/utils/server-fn.ts";
import { searchBooks } from "#@/lib/shared/utils/search-utils.ts";

type SearchResult = {
  books: Awaited<ReturnType<typeof getBooks>>;
  query: string;
};

const searchBooksServerFn = createServerFn({
  method: "GET",
})
  .middleware([errorLogging])
  .inputValidator((d: { q: string }): { q: string } => ({
    q: typeof d.q === "string" ? d.q : "",
  }))
  .handler(async ({ data: { q } }): Promise<SearchResult> => {
    const books = await getBooks();
    return { books: await searchBooks(books, q), query: q };
  });

export const Route = createFileRoute("/hledat")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  loaderDeps: ({ search }) => ({ q: search["q"] }),
  loader: async ({ deps: { q } }) => searchBooksServerFn({ data: { q } }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.query ? `Hledání: ${loaderData.query}` : "Hledání",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),
  component: SearchComponent,
});

function SearchComponent() {
  const { books, query } = Route.useLoaderData();

  return <SearchPage query={query} books={books} />;
}
