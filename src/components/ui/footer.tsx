import { Link } from "./link.tsx";

export function Footer() {
  return (
    <footer className="border-t-4 border-double border-border mt-auto p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto text-center text-sm text-muted-foreground">
        <div>
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
