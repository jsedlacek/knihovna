import { SearchIcon } from "lucide-react";

import { Divider } from "./divider.tsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  searchQuery?: string;
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#fde047"
        d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
      />
      <path
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
      />
      <g fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v14" />
        <path d="M16 12h2" />
        <path d="M16 8h2" />
        <path d="M6 12h2" />
        <path d="M6 8h2" />
      </g>
    </svg>
  );
}

const hasBreadcrumbs = (bc: BreadcrumbItem[] | undefined): bc is BreadcrumbItem[] =>
  bc !== undefined && bc.length > 0;

export function Header({ breadcrumbs, searchQuery }: HeaderProps) {
  return (
    <header>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center gap-1 min-w-0">
          <a href="/" className="shrink-0 flex items-center gap-1">
            <BookIcon className="size-6" />
            {!hasBreadcrumbs(breadcrumbs) && (
              <span className="text-base font-bold">Nejlepší e-knihy zdarma</span>
            )}
          </a>
          {hasBreadcrumbs(breadcrumbs) && (
            <nav className="flex items-center text-base text-muted-foreground min-w-0">
              <span className="flex items-center shrink-0">
                <a href="/" className="text-link underline whitespace-nowrap ml-1">
                  Domů
                </a>
              </span>
              {breadcrumbs.map((item, i) => (
                <span
                  key={item.label}
                  className={`flex items-center ${i === breadcrumbs.length - 1 ? "min-w-0" : "shrink-0"}`}
                >
                  <span className="mx-1 shrink-0">/</span>
                  {item.href ? (
                    <a href={item.href} className="text-link underline whitespace-nowrap">
                      {item.label}
                    </a>
                  ) : (
                    <span className="truncate">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
        <form action="/hledat" method="get" className="mt-3 relative">
          <SearchIcon
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="search"
            name="q"
            placeholder="Hledat knihy…"
            defaultValue={searchQuery}
            className="w-full pl-9 pr-3 py-2 rounded-full border border-border bg-muted text-sm tracking-wide placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
          />
        </form>
      </div>

      <Divider />
    </header>
  );
}
