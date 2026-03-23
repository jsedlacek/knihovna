import { createMiddleware } from "@tanstack/react-start";
import { createLogger } from "#@/lib/server/utils/logger.ts";

const log = createLogger("route");

/**
 * Middleware that logs server function errors with their root cause
 * (message + stack) before re-throwing.
 *
 * Apply to every server function via .middleware([errorLogging]).
 *
 * TODO: Move to global functionMiddleware in src/start.ts via createStart()
 * once the HMR infinite loop with @cloudflare/vite-plugin is resolved.
 * The TanStack router plugin's watchChange handler runs generate() on every
 * file change (not just route files), which creates a rebuild cycle.
 * See: https://github.com/TanStack/router/issues/4627
 */
export const errorLogging = createMiddleware({ type: "function" }).server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    log.error("Unhandled route error", {
      error,
    });
    throw error;
  }
});
