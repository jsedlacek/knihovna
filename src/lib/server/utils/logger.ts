import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  type LogLevel,
} from "@logtape/logtape";

const levelEnv = process.env["LOG_LEVEL"] ?? "info";

function parseLevel(level: string): LogLevel | null {
  if (level === "silent") return null;
  if (level === "warn") return "warning";
  return level as LogLevel;
}

export async function configureLogging() {
  await configure({
    sinks: {
      console: getConsoleSink({
        formatter: getJsonLinesFormatter({ properties: "flatten" }),
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
