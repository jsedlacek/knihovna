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

const mode = (import.meta.env?.MODE ?? process.env?.["NODE_ENV"] ?? "production") as
  | "development"
  | "production";

export async function configureLogging() {
  const jsonFormatter = getJsonLinesFormatter({ properties: "flatten" });

  await configure({
    sinks: {
      console: getConsoleSink({
        formatter: mode === "production" ? jsonFormatter : prettyFormatter,
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
