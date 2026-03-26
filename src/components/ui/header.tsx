import { BookOpenTextIcon, SearchIcon } from "lucide-react";

export function Header() {
  return (
    <header>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <a
            href="/"
            aria-label="Domů"
            className="shrink-0 size-10 bg-foreground rounded-full flex items-center justify-center"
          >
            <BookOpenTextIcon className="size-5 text-background" />
          </a>
          <div className="ml-auto shrink-0">
            <a
              href="/hledat"
              aria-label="Hledat"
              className="size-10 rounded-full border-2 border-foreground flex items-center justify-center cursor-pointer"
            >
              <SearchIcon className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
