import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  type LogLevel,
} from "@logtape/logtape";
import { getPrettyFormatter } from "@jsedlacek/logtape-pretty";

const levelEnv = process.env["LOG_LEVEL"] ?? "info";

function parseLevel(level: string): LogLevel | null {
  if (level === "silent") return null;
  if (level === "warn") return "warning";
  return level as LogLevel;
}

const isDev = import.meta.env?.DEV === true || process.env["NODE_ENV"] === "development";
const isCI = process.env["CI"] === "true";

const usePrettyLogs = isDev || isCI;

export async function configureLogging() {
  const jsonFormatter = getJsonLinesFormatter({ properties: "flatten" });
  const prettyFormatter = getPrettyFormatter({ color: import.meta.env?.DEV ? true : undefined });

  await configure({
    sinks: {
      console: getConsoleSink({
        // Force colors in dev — Vite pipes stdout so TTY auto-detection fails
        formatter: usePrettyLogs ? prettyFormatter : jsonFormatter,
      }),
    },
    loggers: [
      {
        category: ["logtape", "meta"],
        lowestLevel: "warning",
      },
      {
        category: ["knihovna"],
        sinks: ["console"],
        lowestLevel: parseLevel(levelEnv),
      },
    ],
    reset: isDev,
  });
}

export function createLogger(component: string) {
  return getLogger(["knihovna", component]);
}
