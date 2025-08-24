import { Link } from "./link.tsx";

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
        <div>
          Zdroje:{" "}
          <Link href="https://mlp.cz" className="text-blue-600">
            Městská knihovna v Praze
          </Link>
          ,{" "}
          <Link href="https://goodreads.com" className="text-blue-600">
            Goodreads
          </Link>
        </div>
        <div className="mt-2">
          Autor:{" "}
          <Link href="https://jakub.contact/" className="text-blue-600">
            Jakub Sedláček
          </Link>
        </div>
      </div>
    </footer>
  );
}
