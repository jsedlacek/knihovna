import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderProps {
  title?: string;
  subtitle?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-11 shrink-0"
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

export function Header({ title = "Nejlepší e-knihy zdarma", subtitle, breadcrumbs }: HeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-start gap-3 min-w-0">
          <a href="/" aria-label="Domů">
            <BookIcon />
          </a>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold truncate">{title}</h1>
            {subtitle && <div className="text-sm text-muted-foreground truncate">{subtitle}</div>}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center text-sm text-muted-foreground min-w-0">
                {breadcrumbs.map((item, i) => (
                  <span
                    key={item.label}
                    className={`flex items-center ${i === breadcrumbs.length - 1 ? "min-w-0" : "shrink-0"}`}
                  >
                    {i > 0 && <span className="mx-1 shrink-0">/</span>}
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
        </div>
      </div>
    </header>
  );
}
