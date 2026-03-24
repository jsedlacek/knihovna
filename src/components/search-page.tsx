import { BookCard } from "#@/components/book-card.tsx";
import { Footer } from "#@/components/ui/footer.tsx";
import { Header } from "#@/components/ui/header.tsx";
import type { Book } from "#@/lib/shared/types/book-types.ts";
import { MIN_SEARCH_LENGTH } from "#@/lib/shared/utils/search-utils.ts";
import { formatNumberCzech } from "#@/lib/shared/utils/text-utils.ts";

interface SearchPageProps {
  query: string;
  books: Book[];
}

export function SearchPage({ query, books }: SearchPageProps) {
  const isShortQuery = query.length > 0 && query.length < MIN_SEARCH_LENGTH;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        searchQuery={query}
        breadcrumbs={[{ label: "Domů", href: "/" }, { label: "Hledání" }]}
      />

      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Výsledky hledání</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isShortQuery
                ? `Zadejte alespoň ${MIN_SEARCH_LENGTH} znaky pro vyhledávání.`
                : query.length === 0
                  ? "Zadejte hledaný výraz do pole výše."
                  : books.length === 0
                    ? `Pro „${query}" nebyly nalezeny žádné knihy.`
                    : `Nalezeno ${formatNumberCzech(books.length)} ${books.length === 1 ? "kniha" : books.length < 5 ? "knihy" : "knih"} pro „${query}"`}
            </p>
          </div>
          <div className="space-y-10">
            {books.map((book, index) => (
              <div key={book.titulKey}>
                <BookCard book={book} index={index} />
              </div>
            ))}
          </div>
          {books.length > 0 && <p className="text-center text-muted-foreground pt-8 text-2xl">❧</p>}
        </section>
      </main>

      <Footer />
    </div>
  );
}
