import pino from "pino";
import { config } from "./environment";

const isProd = config.NODE_ENV === "production";

const baseOptions: pino.LoggerOptions = {
  level: isProd ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "request.headers.authorization",
      "req.headers.cookie",
      "request.headers.cookie",
      "password",
      "authorization",
    ],
    censor: "[REDACTED]",
  },
  formatters: isProd ? { level: (label) => ({ level: label }) } : undefined,
  timestamp: isProd ? pino.stdTimeFunctions.isoTime : undefined,
};

export const logger = pino({
  ...baseOptions,
  transport: !isProd
    ? {
        target: "pino-pretty",
        options: { colorize: true },
      }
    : undefined,
});

export const loggerOptions: pino.LoggerOptions = {
  ...baseOptions,
  transport: !isProd
    ? {
        target: "pino-pretty",
        options: { colorize: true },
      }
    : undefined,
};
