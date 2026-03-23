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
      className="h-6 shrink-0"
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-base font-bold">{title}</h1>
          <BookIcon />
        </div>
        {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="text-sm text-muted-foreground">
            {breadcrumbs.map((item, i) => (
              <span key={item.label}>
                {i > 0 && <span className="mx-1">/</span>}
                {item.href ? (
                  <a href={item.href} className="text-link underline">
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
