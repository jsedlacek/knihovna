import { BookOpenTextIcon, SearchIcon } from "lucide-react";

export interface HeaderProps {
  title?: string;
  searchQuery?: string;
}

const showSearchInput = (searchQuery: string | undefined): searchQuery is string =>
  searchQuery !== undefined;

export function Header({ title, searchQuery }: HeaderProps) {
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
          {title && <span className="text-base font-bold truncate min-w-0">{title}</span>}
          <div className="ml-auto shrink-0">
            {!showSearchInput(searchQuery) && (
              <a
                href="/hledat"
                aria-label="Hledat"
                className="size-10 bg-foreground rounded-lg flex items-center justify-center cursor-pointer"
              >
                <SearchIcon className="size-5 text-background" />
              </a>
            )}
          </div>
        </div>
        {showSearchInput(searchQuery) && (
          <form action="/hledat" method="get" className="mt-4 relative">
            <SearchIcon
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="search"
              name="q"
              placeholder="Hledat knihy…"
              defaultValue={searchQuery}
              autoFocus
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-muted text-base tracking-wide placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
            />
          </form>
        )}
      </div>
    </header>
  );
}
