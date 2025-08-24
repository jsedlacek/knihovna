import icon from "#@/images/icon.svg";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackLink?: boolean;
}

export function Header({
  title = "Nejlepší e-knihy zdarma",
  subtitle,
  showBackLink = false,
}: HeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-base font-bold">{title}</h1>
          <img src={icon} alt="Book icon" className="h-lh flex-shrink-0" />
        </div>
        {subtitle && (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        )}
        {showBackLink && (
          <div className="text-sm text-muted-foreground">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Zpět na hlavní stránku
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
