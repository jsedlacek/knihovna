import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  type LogLevel,
} from "@logtape/logtape";
import { prettyFormatter } from "@jsedlacek/logtape-pretty";

const levelEnv = process.env["LOG_LEVEL"] ?? "info";

function parseLevel(level: string): LogLevel | null {
  if (level === "silent") return null;
  if (level === "warn") return "warning";
  return level as LogLevel;
}

const usePrettyLogs =
  import.meta.env?.DEV === true ||
  process.env["CI"] === "true" ||
  process.env["NODE_ENV"] === "development";

export async function configureLogging() {
  const jsonFormatter = getJsonLinesFormatter({ properties: "flatten" });

  await configure({
    sinks: {
      console: getConsoleSink({
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
  });
}

export function createLogger(component: string) {
  return getLogger(["knihovna", component]);
}
