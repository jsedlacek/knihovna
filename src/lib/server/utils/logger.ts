type LogFn = {
  (message: string): void;
  (data: Record<string, unknown>, message: string): void;
};

interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
}

const LOG_LEVELS = { silent: 0, fatal: 1, error: 2, warn: 3, info: 4, debug: 5 } as const;

const configuredLevel = (process.env["LOG_LEVEL"] ?? "info") as keyof typeof LOG_LEVELS;
const threshold = LOG_LEVELS[configuredLevel] ?? LOG_LEVELS.info;

function makeLogFn(
  level: keyof typeof LOG_LEVELS,
  consoleFn: (...args: unknown[]) => void,
  prefix?: string,
): LogFn {
  return (...args: [string] | [Record<string, unknown>, string]) => {
    if (threshold < LOG_LEVELS[level]) return;
    const [first, second] = args;
    const message = typeof first === "string" ? first : second;
    const data = typeof first === "object" ? first : undefined;
    const tag = prefix ? `[${prefix}]` : "";
    if (data) {
      consoleFn(tag, message, data);
    } else {
      consoleFn(tag, message);
    }
  };
}

function makeLogger(prefix?: string): Logger {
  return {
    debug: makeLogFn("debug", console.debug, prefix),
    info: makeLogFn("info", console.info, prefix),
    warn: makeLogFn("warn", console.warn, prefix),
    error: makeLogFn("error", console.error, prefix),
    fatal: makeLogFn("fatal", console.error, prefix),
  };
}

export const logger: Logger = makeLogger();

export function createLogger(component: string): Logger {
  return makeLogger(component);
}
