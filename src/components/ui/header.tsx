import { BookOpenTextIcon, SearchIcon } from "lucide-react";

import { cn } from "./cn.ts";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  searchQuery?: string;
}

const hasBreadcrumbs = (bc: BreadcrumbItem[] | undefined): bc is BreadcrumbItem[] =>
  bc !== undefined && bc.length > 0;

const showSearchInput = (searchQuery: string | undefined): searchQuery is string =>
  searchQuery !== undefined;

export function Header({ breadcrumbs, searchQuery }: HeaderProps) {
  return (
    <header>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center gap-1 min-w-0">
          <a href="/" className="shrink-0 flex items-center gap-2">
            <BookOpenTextIcon className="size-6" />
            {!hasBreadcrumbs(breadcrumbs) && (
              <span className="text-base font-bold">Nejlepší e-knihy zdarma</span>
            )}
          </a>
          {hasBreadcrumbs(breadcrumbs) && (
            <nav className="flex items-center text-base text-muted-foreground min-w-0">
              <span className="flex items-center shrink-0">
                <a href="/" className="text-link hover:underline whitespace-nowrap ml-1">
                  Domů
                </a>
              </span>
              {breadcrumbs.map((item, i) => (
                <span
                  key={item.label}
                  className={cn(
                    "flex items-center",
                    i === breadcrumbs.length - 1 ? "min-w-0" : "shrink-0",
                  )}
                >
                  <span className="mx-1 shrink-0">/</span>
                  {item.href ? (
                    <a href={item.href} className="text-link hover:underline whitespace-nowrap">
                      {item.label}
                    </a>
                  ) : (
                    <span className="truncate">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className="ml-auto shrink-0">
            {!showSearchInput(searchQuery) && (
              <a
                href="/hledat"
                aria-label="Hledat"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex"
              >
                <SearchIcon size={20} />
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
