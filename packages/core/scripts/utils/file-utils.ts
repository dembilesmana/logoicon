import { mkdir, readFile, writeFile } from "node:fs/promises";
import { logger } from "@logoicon/logger";
import { FileProcessingError } from "../types/generation.types";
import { validatePath } from "./path-utils";

// Cache for created directories to avoid redundant mkdir calls
const createdDirs = new Set<string>();

/**
 * Ensure directory exists, creating it if necessary
 * Uses caching to avoid redundant mkdir operations
 */
export const ensureDirectory = async (dir: string): Promise<void> => {
  validatePath(dir);

  if (!createdDirs.has(dir)) {
    try {
      await mkdir(dir, { recursive: true });
      createdDirs.add(dir);
      logger.debug({ dir }, "Created directory");
    } catch (error) {
      throw new FileProcessingError(
        `Failed to create directory: ${dir}`,
        dir,
        error as Error,
      );
    }
  }
};

/**
 * Read file with proper error handling and logging
 */
export const readFileWithErrorHandling = async (
  filePath: string,
  encoding: BufferEncoding = "utf-8",
): Promise<string> => {
  validatePath(filePath);

  try {
    const content = await readFile(filePath, { encoding });
    logger.debug({ filePath, size: content.length }, "Read file successfully");
    return content;
  } catch (error) {
    logger.error({ filePath, error }, "Failed to read file");
    throw new FileProcessingError(
      `Failed to read file: ${filePath}`,
      filePath,
      error as Error,
    );
  }
};

/**
 * Write file with proper error handling and logging
 */
export const writeFileWithErrorHandling = async (
  filePath: string,
  content: string,
  encoding: BufferEncoding = "utf-8",
): Promise<void> => {
  validatePath(filePath);

  try {
    await writeFile(filePath, content, { encoding });
    logger.debug({ filePath, size: content.length }, "Wrote file successfully");
  } catch (error) {
    logger.error({ filePath, error }, "Failed to write file");
    throw new FileProcessingError(
      `Failed to write file: ${filePath}`,
      filePath,
      error as Error,
    );
  }
};

/**
 * Write multiple files concurrently with proper error handling
 */
export const writeFiles = async (
  files: Array<{ path: string; content: string }>,
): Promise<void> => {
  const writePromises = files.map(({ path, content }) =>
    writeFileWithErrorHandling(path, content),
  );

  try {
    await Promise.all(writePromises);
    logger.debug({ count: files.length }, "Wrote multiple files successfully");
  } catch (error) {
    logger.error(
      {
        error,
        count: files.length,
      },
      "Failed to write multiple files",
    );
    throw error;
  }
};

/**
 * Get file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Clear the directory cache (useful for testing)
 */
export const clearDirectoryCache = (): void => {
  createdDirs.clear();
};
