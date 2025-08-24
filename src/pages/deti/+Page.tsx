import { useData } from "vike-react/useData";
import { GenrePage } from "#@/components/genre-page.tsx";
import type { Data } from "./+data.ts";

export default function Page() {
  const { books } = useData<Data>();

  return <GenrePage books={books} genreKey="deti" />;
}
