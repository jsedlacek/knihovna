import { createMiddleware, createStart } from "@tanstack/react-start";
import { createLogger } from "#@/lib/server/utils/logger.ts";

const log = createLogger("route");

const errorLoggingMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    log.error("Unhandled route error", {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    });
    throw error;
  }
});

export default createStart(() => ({
  functionMiddleware: [errorLoggingMiddleware],
}));
