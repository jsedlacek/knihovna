/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "#@/styles/app.css?url";

function LostBookIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mx-auto mb-6 text-muted-foreground/40"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M9 10l2 2 4-4" opacity="0.3" />
        <path d="M8 7h8M8 11h5" opacity="0.4" />
      </g>
    </svg>
  );
}

function ErrorPage({ code, title, message }: { code: string; title: string; message: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <a href="/" className="text-base font-bold hover:text-muted-foreground transition-colors">
            Nejlepší e-knihy zdarma
          </a>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <LostBookIllustration />
          <p className="text-sm font-bold tracking-widest text-muted-foreground/60 uppercase mb-2">
            {code}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h1>
          <p className="text-muted-foreground mb-8">{message}</p>
          <a
            href="/"
            className="inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Zpět na hlavní stránku
          </a>
        </div>
      </main>
      <footer className="border-t border-border p-4 sm:p-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground" />
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Stránka nenalezena"
      message="Omlouváme se, ale stránka kterou hledáte neexistuje."
    />
  );
}

function RootErrorComponent() {
  return (
    <ErrorPage
      code="Chyba"
      title="Něco se pokazilo"
      message="Omlouváme se, při načítání stránky došlo k chybě."
    />
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "UTF-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      {
        title: "Nejlepší e-knihy zdarma",
      },
      {
        name: "description",
        content:
          "Nejlepší české e-knihy zdarma z městské knihovny. Moderní romány, klasika, poezie i divadelní hry s hodnocením 4,0 a vyšším.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:locale",
        content: "cs_CZ",
      },
      {
        property: "og:site_name",
        content: "Nejlepší e-knihy zdarma",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icon.svg",
      },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
