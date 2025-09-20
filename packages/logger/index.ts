import type { Logger, LoggerOptions } from "pino";

import { readFileSync } from "fs";
import { resolve } from "path";
import pino from "pino";
import deepmerge from "deepmerge";

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
    const pkgPath = resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.name;
  } catch {
    return undefined;
  }
}

export function createLogger(options?: Partial<LoggerOptions>): Logger {
  const pkgName = getCallerPackageName();

  return pino({
    name: options?.name || pkgName,
    ...deepmerge(defaultOptions, options || {}),
  });
}

export const logger = createLogger();
