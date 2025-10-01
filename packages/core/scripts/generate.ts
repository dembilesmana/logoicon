import { logger } from "@logoicon/logger";
import { createWriteStream, mkdirSync, rmSync } from "node:fs";
import { opendir } from "node:fs/promises";
import { join } from "node:path";

// Import our new modules
import { getConfig } from "./config/generation.config";
import { createConcurrencyLimiter } from "./lib/concurrency-limiter";
import { createFileGenerator } from "./lib/file-generator";
import { IndexStreamWriter, MetadataStreamWriter } from "./lib/stream-writer";
import { createSvgProcessor } from "./lib/svg-processor";
import { AssetEntry } from "./types/generation.types";
import { createAssetPaths } from "./utils/path-utils";

// Re-export types for backward compatibility
export type { Metadata } from "./types/generation.types";

/**
 * Setup the generation environment
 */
async function setupEnvironment(): Promise<void> {
  const config = getConfig();

  logger.info(
    {
      sourceDir: config.SRCDIR,
      outputDir: config.OUTDIR,
      maxConcurrency: config.MAX_CONCURRENCY,
    },
    "Setting up generation environment",
  );

  // Clean and recreate output directory
  rmSync(config.OUTDIR, { recursive: true, force: true });
  mkdirSync(config.OUTDIR);

  logger.debug("Environment setup completed");
}

/**
 * Collect all asset files from the source directory
 */
async function collectAssetFiles(): Promise<AssetEntry[]> {
  const config = getConfig();
  const assets = await opendir(config.SRCDIR, { recursive: true });
  const files: AssetEntry[] = [];

  logger.info({ sourceDir: config.SRCDIR }, "Collecting asset files");

  for await (const entry of assets) {
    if (entry.isFile()) {
      files.push({
        name: entry.name,
        parentPath: entry.parentPath,
        isFile: () => true,
      });
    }
  }

  logger.info(
    {
      totalFiles: files.length,
      sourceDir: config.SRCDIR,
    },
    "Asset files collected",
  );

  return files;
}

/**
 * Initialize stream writers
 */
function createStreamWriters(): {
  indexWriter: IndexStreamWriter;
  metadataWriter: MetadataStreamWriter;
} {
  const config = getConfig();

  const indexStream = createWriteStream(join(config.OUTDIR, "index.ts"));
  const metadataStream = createWriteStream(
    join(config.OUTDIR, "metadata.ndjson"),
  );

  const indexWriter = new IndexStreamWriter(indexStream);
  const metadataWriter = new MetadataStreamWriter(metadataStream);

  logger.debug("Stream writers initialized");

  return { indexWriter, metadataWriter };
}

/**
 * Process all asset files with concurrency control
 */
async function processAllFiles(files: AssetEntry[]): Promise<void> {
  const config = getConfig();

  logger.info(
    {
      totalFiles: files.length,
      maxConcurrency: config.MAX_CONCURRENCY,
    },
    "Starting file processing",
  );

  // Initialize dependencies
  const limiter = createConcurrencyLimiter(config.MAX_CONCURRENCY);
  const svgProcessor = await createSvgProcessor();
  const { indexWriter, metadataWriter } = createStreamWriters();
  const fileGenerator = createFileGenerator(
    svgProcessor,
    indexWriter,
    metadataWriter,
  );

  // Initialize progress tracking
  fileGenerator.initializeProgress(files.length);

  // Process files with concurrency control
  const processingPromises = files.map((file) =>
    limiter.run(async () => {
      try {
        const assetPaths = createAssetPaths(file.parentPath, file.name);
        await fileGenerator.processAssetFile(assetPaths);
      } catch (error) {
        logger.error(
          {
            fileName: file.name,
            parentPath: file.parentPath,
            error,
          },
          "Failed to process file",
        );
        throw error;
      }
    }),
  );

  // Wait for all files to be processed
  try {
    await Promise.all(processingPromises);
    await limiter.onIdle();
    await fileGenerator.finalize();

    logger.info(
      {
        totalFiles: files.length,
      },
      "File processing completed successfully",
    );
  } catch (error) {
    logger.error({ error }, "File processing failed");

    // Attempt to cleanup streams even if processing failed
    try {
      await fileGenerator.finalize();
    } catch (cleanupError) {
      logger.error(
        {
          cleanupError,
        },
        "Failed to cleanup after processing error",
      );
    }

    throw error;
  }
}

/**
 * Main generation function
 */
async function generateAssets(): Promise<void> {
  const startTime = Date.now();

  try {
    logger.info("Starting asset generation");

    await setupEnvironment();
    const files = await collectAssetFiles();
    await processAllFiles(files);

    const duration = Date.now() - startTime;
    logger.info(
      {
        duration: `${duration}ms`,
        totalFiles: files.length,
        avgTimePerFile: `${(duration / files.length).toFixed(2)}ms`,
      },
      "Asset generation completed successfully",
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      {
        error,
        duration: `${duration}ms`,
      },
      "Asset generation failed",
    );
    throw error;
  }
}

/**
 * Run generation if this file is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAssets()
    .then(() => {
      logger.info("Generation process finished successfully");
      process.exit(0);
    })
    .catch((error) => {
      logger.error({ error }, "Generation process failed");
      process.exit(1);
    });
}
