import { SearchIcon } from "lucide-react";
import { BookCard } from "#@/components/book-card.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { MIN_SEARCH_LENGTH } from "#@/lib/shared/utils/search-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

const searchTips = [
  { query: "Čapek", label: "Čapek" },
  { query: "Sherlock", label: "Sherlock" },
  { query: "Hrabal", label: "Hrabal" },
  { query: "pohádky", label: "pohádky" },
  { query: "Hugo", label: "Hugo" },
  { query: "básně", label: "básně" },
];

interface SearchPageProps {
  query: string;
  books: Book[];
  lastUpdated?: string;
}

export function SearchPage({ query, books, lastUpdated }: SearchPageProps) {
  const isShortQuery = query.length > 0 && query.length < MIN_SEARCH_LENGTH;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Hledání</h2>
          <form action="/hledat" method="get" className="relative">
            <SearchIcon
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="search"
              name="q"
              placeholder="Hledat knihy…"
              defaultValue={query}
              autoFocus={query.length === 0}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-muted text-base tracking-wide placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
            />
          </form>
          <div>
            <p className="text-base text-muted-foreground">
              {isShortQuery
                ? `Zadejte alespoň ${MIN_SEARCH_LENGTH} znaky pro vyhledávání.`
                : query.length === 0
                  ? "Zadejte hledaný výraz."
                  : books.length === 0
                    ? `Pro „${query}" nebyly nalezeny žádné knihy.`
                    : `Nalezeno ${formatNumberCzech(books.length)} ${books.length === 1 ? "kniha" : books.length < 5 ? "knihy" : "knih"} pro „${query}"`}
            </p>
            {query.length === 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Zkuste:</span>
                {searchTips.map((tip) => (
                  <a
                    key={tip.query}
                    href={`/hledat?q=${encodeURIComponent(tip.query)}`}
                    className="text-sm px-3 py-1 rounded-full border border-border bg-muted hover:bg-border transition-colors"
                  >
                    {tip.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-12">
            {books.map((book, index) => (
              <div key={book.titulKey}>
                <BookCard book={book} index={index} hideActions />
              </div>
            ))}
          </div>
          {books.length > 0 && <p className="text-center text-muted-foreground pt-8 text-2xl">❧</p>}
        </section>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
}
