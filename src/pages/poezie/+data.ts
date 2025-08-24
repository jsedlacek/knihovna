import { loadGenreData } from "#@/lib/server/genre-data-loader.ts";
import type { Book } from "#@/lib/shared/types/book-types.ts";

export type Data = {
  books: Book[];
};

export default async function data(): Promise<Data> {
  return await loadGenreData("poezie");
}
