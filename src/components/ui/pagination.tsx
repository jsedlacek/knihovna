import { getButtonClasses } from "#@/components/ui/button.tsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageHref(page: number): string {
  return `?strana=${String(page)}`;
}

export function PageIndicator({ currentPage, totalPages }: PaginationProps) {
  if (currentPage <= 1 || totalPages <= 1) return null;

  return (
    <p className="text-sm text-muted-foreground">
      Strana {currentPage} z {totalPages}
    </p>
  );
}

export function PageNavigation({ currentPage, totalPages }: PaginationProps) {
  if (currentPage <= 1 || totalPages <= 1) return null;

  return (
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
  );
}
