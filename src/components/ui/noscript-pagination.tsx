import { getButtonClasses } from "#@/components/ui/button.tsx";

interface NoScriptPaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageHref(page: number): string {
  return page === 1 ? "." : `?strana=${String(page)}`;
}

export function NoScriptPageIndicator({ currentPage, totalPages }: NoScriptPaginationProps) {
  if (currentPage <= 1 || totalPages <= 1) return null;

  return (
    <noscript>
      <p className="text-sm text-muted-foreground">
        Strana {currentPage} z {totalPages}
      </p>
    </noscript>
  );
}

export function NoScriptPagination({ currentPage, totalPages }: NoScriptPaginationProps) {
  if (currentPage <= 1 || totalPages <= 1) return null;

  return (
    <noscript>
      <nav className="flex justify-center items-center gap-3 pt-8" aria-label="Stránkování">
        <a href={getPageHref(currentPage - 1)} className={getButtonClasses("secondary")}>
          ← Předchozí
        </a>
        <span className="text-sm text-muted-foreground">
          Strana {currentPage} z {totalPages}
        </span>
        {currentPage < totalPages && (
          <a href={getPageHref(currentPage + 1)} className={getButtonClasses("secondary")}>
            Další →
          </a>
        )}
      </nav>
    </noscript>
  );
}
