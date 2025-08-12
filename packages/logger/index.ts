import type { Logger, LoggerOptions } from "pino";

import { readFileSync } from "fs";
import path from "path";
import pino from "pino";

const defaultOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
};

function getCallerPackageName(): string | undefined {
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.name;
  } catch {
    return undefined;
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  const pkgName = getCallerPackageName();

  return pino({
    ...defaultOptions,
    ...options,
    name: options?.name || pkgName,
    transport: {
      ...defaultOptions.transport,
      ...options?.transport,
    },
  });
}

export const logger = createLogger();
