import { existsSync } from "node:fs";
import { GenerationConfig, ConfigurationError } from "../types/generation.types";

export const GENERATION_CONFIG: GenerationConfig = {
  SRCDIR: "assets",
  OUTDIR: ".assets",
  MAX_CONCURRENCY: 64,
  CHUNK_SIZE: 1024 * 64, // 64KB chunks for stream writing
} as const;

export const validateConfig = (): void => {
  if (!existsSync(GENERATION_CONFIG.SRCDIR)) {
    throw new ConfigurationError(
      `Source directory does not exist: ${GENERATION_CONFIG.SRCDIR}`
    );
  }

  if (GENERATION_CONFIG.MAX_CONCURRENCY <= 0) {
    throw new ConfigurationError(
      `MAX_CONCURRENCY must be greater than 0, got: ${GENERATION_CONFIG.MAX_CONCURRENCY}`
    );
  }

  if (GENERATION_CONFIG.CHUNK_SIZE <= 0) {
    throw new ConfigurationError(
      `CHUNK_SIZE must be greater than 0, got: ${GENERATION_CONFIG.CHUNK_SIZE}`
    );
  }
};

export const getConfig = (): GenerationConfig => {
  validateConfig();
  return GENERATION_CONFIG;
};
