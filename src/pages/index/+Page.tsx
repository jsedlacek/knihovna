import { useData } from "vike-react/useData";
import { HomePage } from "#@/components/home-page.tsx";
import type { Data } from "./+data.ts";

export default function Page() {
  const { books, lastUpdated, formattedLastUpdated } = useData<Data>();

  return (
    <HomePage
      books={books}
      lastUpdated={lastUpdated}
      formattedLastUpdated={formattedLastUpdated}
    />
  );
}
