import { basename, dirname, extname, join } from "node:path";
import pluralize from "pluralize";
import { normalize } from "@logoicon/util";
import { ParsedFileName, AssetPaths, FileProcessingError } from "../types/generation.types";

/**
 * Parse filename to extract category, color, and mode information
 */
export const parseFileName = (fileName: string): ParsedFileName => {
  const name = basename(fileName, extname(fileName));
  const match = name.match(
    /^(?<category>[^-]+)(?:-(?<color>mono))?(?:-(?<mode>dark|light))?$/
  );

  if (!match?.groups) {
    throw new FileProcessingError(
      `Invalid filename format. Expected format: category[-mono][-dark|light]`,
      fileName
    );
  }

  const { category, color, mode } = match.groups;

  return {
    category: pluralize(category!),
    color: (color as 'mono') || 'default',
    mode: (mode as 'dark' | 'light') || 'default',
    brand: '',
    name,
  };
};

/**
 * Generate all necessary paths for asset processing
 */
export const createAssetPaths = (parentPath: string, fileName: string): AssetPaths => {
  const name = basename(fileName, extname(fileName));
  const parsed = parseFileName(fileName);

  const brand = parentPath.split("/").at(-1);
  if (!brand) {
    throw new FileProcessingError(
      `Unable to extract brand from parent path`,
      parentPath
    );
  }

  const title = [brand, normalize(name)].join(" ");
  const inputPath = join(parentPath, fileName);
  const outputDir = `.${dirname(inputPath)}`;
  const tsOutput = `${join(outputDir, name)}.ts`;
  const jsonOutput = `${join(outputDir, name)}.json`;

  return {
    name,
    color: parsed.color,
    mode: parsed.mode,
    category: parsed.category,
    brand,
    title,
    inputPath,
    outputDir,
    tsOutput,
    jsonOutput,
  };
};

/**
 * Validate that a path is safe for file operations
 */
export const validatePath = (path: string): void => {
  if (!path || path.trim() === '') {
    throw new FileProcessingError('Path cannot be empty', path);
  }

  if (path.includes('..')) {
    throw new FileProcessingError('Path traversal detected', path);
  }

  if (path.startsWith('/')) {
    throw new FileProcessingError('Absolute paths are not allowed', path);
  }
};

/**
 * Normalize path separators for cross-platform compatibility
 */
export const normalizePath = (path: string): string => {
  return path.replace(/\\/g, '/');
};
