import { createLogger } from "#@/lib/server/utils/logger.ts";

const log = createLogger("route");

/**
 * Wraps a server function handler to log errors with their root cause
 * before re-throwing. Use this instead of a plain handler to ensure
 * error details (message + stack) appear in logs rather than just a 500 status.
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
