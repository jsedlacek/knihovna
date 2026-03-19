import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  type LogLevel,
} from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";

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
  await configure({
    sinks: {
      console: getConsoleSink({
        formatter:
          mode === "production"
            ? getJsonLinesFormatter({ properties: "flatten" })
            : getPrettyFormatter({
                properties: true,
                icons: false,
                timestampColor: null,
                timestampStyle: "dim",
                categoryColor: null,
                categoryStyle: "dim",
                messageColor: null,
                messageStyle: null,
                levelStyle: "bold",
                levelColors: {
                  debug: "blue",
                  info: "green",
                  warning: "yellow",
                  error: "red",
                  fatal: "magenta",
                },
              }),
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
