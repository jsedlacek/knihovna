// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultOnCatch: (error) => {
      console.error("Unhandled render error", error);
    },
  });

  return router;
}
