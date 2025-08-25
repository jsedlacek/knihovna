import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BookCard } from "#@/components/book-card.tsx";
import { Card } from "#@/components/ui/card.tsx";
import { loadGenreData } from "#@/lib/server/genre-data-loader.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

const getDebugData = createServerFn({
  method: "GET",
}).handler(async () => {
  const data = await loadGenreData("beletrie");

  let books: Book[] = data.books;

  let debugBook = books.find(
    (book) =>
      book.detailUrl === "https://search.mlp.cz/cz/titul/honzlova/4323983/",
  );

  if (!debugBook) {
    throw new Error("Debug book not found");
  }

  // Log the book data to console
  console.log("Debug book data:", JSON.stringify(debugBook, null, 2));

  return {
    book: debugBook,
  };
});

export const Route = createFileRoute("/debug")({
  head: () => ({
    meta: [
      {
        title: "Debug - Book Display Test",
      },
      {
        name: "description",
        content: "Debug page for testing book card display with sample data.",
      },
    ],
  }),
  loader: async () => await getDebugData(),
  component: DebugComponent,
});

function DebugComponent() {
  const { book } = Route.useLoaderData();

  // Also log on client side
  console.log("Client-side book data:", book);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Debug - Book Display Test
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Book Card (Normal)</h2>
        <BookCard book={book} index={0} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Book Card (With Scores)</h2>
        <BookCard book={book} index={0} showScores={true} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Raw Book Data</h2>
        <Card className="p-4">
          <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
            {JSON.stringify(book, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}
