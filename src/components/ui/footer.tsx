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
        <p>
          {lastUpdated ? `Data byla stažena ${lastUpdated} z ` : "Data pochází z "}
          <Link href="https://mlp.cz" className="underline">
            Městské knihovny v Praze
          </Link>
          {" a "}
          <Link href="https://goodreads.com" className="underline">
            Goodreads
          </Link>
          {". Vytvořil "}
          <Link href="https://jakub.contact/" className="underline">
            Jakub Sedláček
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
