// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultOnCatch: (error) => {
      if (typeof window === "undefined") {
        import("#@/lib/server/utils/logger.ts").then(({ createLogger }) => {
          const log = createLogger("render");
          log.error("Unhandled render error", {
            error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
          });
        });
      } else {
        console.error("Unhandled render error", error);
      }
    },
  });

  return router;
}
