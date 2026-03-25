import { Divider } from "./divider.tsx";
import { Link } from "./link.tsx";

interface FooterProps {
  lastUpdated?: string | undefined;
}

export function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="mt-auto pt-12">
      <Divider inverse />
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-base text-muted-foreground">
        {lastUpdated && <div>Aktualizováno {lastUpdated}</div>}
        <div className={lastUpdated ? "mt-2" : ""}>
          Zdroje:{" "}
          <Link href="https://mlp.cz" className="underline">
            Městská knihovna v Praze
          </Link>
          ,{" "}
          <Link href="https://goodreads.com" className="underline">
            Goodreads
          </Link>
        </div>
        <div className="mt-2">
          Autor:{" "}
          <Link href="https://jakub.contact/" className="underline">
            Jakub Sedláček
          </Link>
        </div>
      </div>
    </footer>
  );
}
