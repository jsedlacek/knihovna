// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { createLogger } from "#@/lib/server/utils/logger.ts";
import { routeTree } from "./routeTree.gen.ts";

const log = createLogger("render");

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultOnCatch: (error) => {
      log.error("Unhandled render error", {
        error,
      });
    },
  });

  return router;
}
