/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import icon from "#@/images/icon.svg";
import appCss from "#@/styles/app.css?url";

function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Stránka nenalezena</h2>
        <p className="text-muted-foreground mb-8">
          Omlouváme se, ale stránka kterou hledáte neexistuje.
        </p>
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
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: icon,
      },
    ],
  }),
  notFoundComponent: NotFound,
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
