import pino from "pino";

const level = process.env["LOG_LEVEL"] ?? "info";

export const logger = pino({
  level,
  browser: {
    asObject: true,
    write: {
      // Map Pino levels to Cloudflare's native console methods
      // Stringify the object so external log ingestors parse it easily
      fatal: (o) => console.error(JSON.stringify(o)),
      error: (o) => console.error(JSON.stringify(o)),
      warn: (o) => console.warn(JSON.stringify(o)),
      info: (o) => console.log(JSON.stringify(o)),
      debug: (o) => console.debug(JSON.stringify(o)),
      trace: (o) => console.debug(JSON.stringify(o)),
    },
  },
});

export function createLogger(component: string) {
  return logger.child({ component });
}
