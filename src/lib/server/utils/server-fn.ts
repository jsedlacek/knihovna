import { createLogger } from "#@/lib/server/utils/logger.ts";

const log = createLogger("route");

/**
 * Wraps a server function handler to log errors with their root cause
 * before re-throwing. Use this instead of a plain handler to ensure
 * error details (message + stack) appear in logs rather than just a 500 status.
 *
 * Ideally this would be global functionMiddleware in src/start.ts via createStart(),
 * but the TanStack router plugin's watchChange handler runs generate() on every
 * file change (not just route files), which creates an HMR infinite loop with the
 * Cloudflare Vite plugin. See: https://github.com/TanStack/router/issues/4627
 */
export function withErrorLogging<TArgs, TResult>(
  handler: (args: TArgs) => Promise<TResult>,
): (args: TArgs) => Promise<TResult> {
  return async (args: TArgs) => {
    try {
      return await handler(args);
    } catch (error) {
      log.error("Unhandled route error", {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      });
      throw error;
    }
  };
}
