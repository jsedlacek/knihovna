/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "#@/styles/app.css?url";

function ErrorPage({ code, title, message }: { code: string; title: string; message: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">{code}</h1>
        <h2 className="text-2xl mb-6">{title}</h2>
        <p className="text-muted-foreground mb-8">{message}</p>
        <a
          href="/"
          className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded hover:bg-accent/80 transition-colors"
        >
          Zpět na hlavní stránku
        </a>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <RootDocument>
      <ErrorPage
        code="404"
        title="Stránka nenalezena"
        message="Omlouváme se, ale stránka kterou hledáte neexistuje."
      />
    </RootDocument>
  );
}

function RootErrorComponent() {
  return (
    <RootDocument>
      <ErrorPage
        code="Chyba"
        title="Něco se pokazilo"
        message="Omlouváme se, při načítání stránky došlo k chybě."
      />
    </RootDocument>
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
