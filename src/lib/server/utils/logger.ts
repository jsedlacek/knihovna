import pino from "pino";
import pretty from "pino-pretty";

const isDev = process.env["NODE_ENV"] !== "production";
const level = process.env["LOG_LEVEL"] ?? "info";
const stream = isDev ? pretty() : undefined;

export const logger = pino({ level }, stream);

export function createLogger(component: string) {
  return logger.child({ component });
}
