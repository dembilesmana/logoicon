export interface Metadata {
  category: string;
  color: string;
  mode: string;
  name: string;
  brand: string;
  title: string;
  path: string;
}

export interface ParsedFileName {
  category: string;
  color: 'mono' | 'default';
  mode: 'dark' | 'light' | 'default';
  brand: string;
  name: string;
}

export interface AssetPaths {
  name: string;
  color: string;
  mode: string;
  category: string;
  brand: string;
  title: string;
  inputPath: string;
  outputDir: string;
  tsOutput: string;
  jsonOutput: string;
}

export interface AssetEntry {
  name: string;
  parentPath: string;
  isFile: () => boolean;
}

export interface QueueItem<T = unknown> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

export interface GenerationConfig {
  readonly SRCDIR: string;
  readonly OUTDIR: string;
  readonly MAX_CONCURRENCY: number;
  readonly CHUNK_SIZE: number;
}

export class FileProcessingError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FileProcessingError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
