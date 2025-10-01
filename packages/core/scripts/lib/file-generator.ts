import { logger } from "@logoicon/logger";
import { createExport } from "../../ast/create-export";
import { createTS } from "../../ast/create-svg";
import {
  Metadata,
  AssetPaths,
  FileProcessingError,
} from "../types/generation.types";
import { ensureDirectory, writeFiles } from "../utils/file-utils";
import { SvgProcessor } from "./svg-processor";
import { IndexStreamWriter, MetadataStreamWriter } from "./stream-writer";

/**
 * Progress tracker for file generation
 */
export class ProgressTracker {
  private processed = 0;

  constructor(private readonly total: number) {
    if (total <= 0) {
      throw new Error(`Total must be greater than 0, got: ${total}`);
    }
  }

  /**
   * Update progress and log if necessary
   */
  update(): void {
    this.processed++;

    // Log progress at intervals
    if (this.processed % 100 === 0 || this.processed === this.total) {
      const percentage = ((this.processed / this.total) * 100).toFixed(1);
      logger.info(
        {
          processed: this.processed,
          total: this.total,
          percentage: `${percentage}%`,
          remaining: this.total - this.processed,
        },
        "Generation progress",
      );
    }
  }

  /**
   * Get current progress statistics
   */
  getStats() {
    return {
      processed: this.processed,
      total: this.total,
      percentage: (this.processed / this.total) * 100,
      remaining: this.total - this.processed,
      completed: this.processed === this.total,
    };
  }

  /**
   * Reset progress counter
   */
  reset(): void {
    this.processed = 0;
  }
}

/**
 * File generator that handles asset processing and artifact creation
 */
export class FileGenerator {
  private progressTracker: ProgressTracker | null = null;

  constructor(
    private readonly svgProcessor: SvgProcessor,
    private readonly indexWriter: IndexStreamWriter,
    private readonly metadataWriter: MetadataStreamWriter,
  ) {}

  /**
   * Initialize progress tracking
   */
  initializeProgress(totalFiles: number): void {
    this.progressTracker = new ProgressTracker(totalFiles);
    logger.info({ totalFiles }, "Initialized progress tracking");
  }

  /**
   * Process a single asset file and generate all artifacts
   */
  async processAssetFile(assetPaths: AssetPaths): Promise<void> {
    try {
      logger.debug(
        {
          inputPath: assetPaths.inputPath,
          outputDir: assetPaths.outputDir,
        },
        "Processing asset file",
      );

      // Ensure output directory exists
      await ensureDirectory(assetPaths.outputDir);

      // Process SVG file
      const parsedSvg = await this.svgProcessor.processSvgFile(
        assetPaths.inputPath,
      );

      // Generate TypeScript content
      const tsContent = createTS(assetPaths.title, parsedSvg);

      // Create file artifacts
      await this.createFileArtifacts(assetPaths, parsedSvg, tsContent);

      // Create metadata
      const metadata = this.createMetadata(assetPaths);

      // Write to streams
      await this.writeToStreams(metadata, tsContent);

      // Update progress
      if (this.progressTracker) {
        this.progressTracker.update();
      }

      logger.debug(
        {
          inputPath: assetPaths.inputPath,
          tsOutput: assetPaths.tsOutput,
          jsonOutput: assetPaths.jsonOutput,
        },
        "Asset file processed successfully",
      );
    } catch (error) {
      logger.error(
        {
          inputPath: assetPaths.inputPath,
          error,
        },
        "Failed to process asset file",
      );

      if (error instanceof FileProcessingError) {
        throw error;
      }

      throw new FileProcessingError(
        `Failed to process asset file: ${assetPaths.inputPath}`,
        assetPaths.inputPath,
        error as Error,
      );
    }
  }

  /**
   * Create file artifacts (TS and JSON files)
   */
  private async createFileArtifacts(
    assetPaths: AssetPaths,
    parsedSvg: any,
    tsContent: string,
  ): Promise<void> {
    const files = [
      {
        path: assetPaths.tsOutput,
        content: tsContent,
      },
      {
        path: assetPaths.jsonOutput,
        content: JSON.stringify(parsedSvg, null, 2),
      },
    ];

    await writeFiles(files);
  }

  /**
   * Create metadata object from asset paths
   */
  private createMetadata(assetPaths: AssetPaths): Metadata {
    return {
      name: assetPaths.name,
      color: assetPaths.color,
      mode: assetPaths.mode,
      category: assetPaths.category,
      title: assetPaths.title,
      brand: assetPaths.brand,
      path: assetPaths.tsOutput,
    };
  }

  /**
   * Write data to index and metadata streams
   */
  private async writeToStreams(
    metadata: Metadata,
    tsContent: string,
  ): Promise<void> {
    try {
      // Generate and write export statement
      const indexExport = await createExport(metadata);
      await this.indexWriter.writeExport(indexExport);

      // Write metadata object
      await this.metadataWriter.writeMetadataObject(metadata);

      logger.debug(
        {
          metadataPath: metadata.path,
        },
        "Written to streams successfully",
      );
    } catch (error) {
      logger.error({ metadata, error }, "Failed to write to streams");
      throw new FileProcessingError(
        `Failed to write to streams for: ${metadata.path}`,
        metadata.path,
        error as Error,
      );
    }
  }

  /**
   * Get current progress statistics
   */
  getProgress() {
    return this.progressTracker?.getStats() || null;
  }

  /**
   * Finalize generation process
   */
  async finalize(): Promise<void> {
    try {
      logger.info("Finalizing file generation");

      // Close streams
      await Promise.all([
        this.indexWriter.close(),
        this.metadataWriter.close(),
      ]);

      const progress = this.getProgress();
      if (progress) {
        logger.info(
          {
            totalProcessed: progress.processed,
            totalFiles: progress.total,
            success: progress.completed,
          },
          "File generation completed",
        );
      }
    } catch (error) {
      logger.error({ error }, "Failed to finalize generation");
      throw new FileProcessingError(
        "Failed to finalize file generation",
        "finalization",
        error as Error,
      );
    }
  }
}

/**
 * Create a file generator instance with required dependencies
 */
export const createFileGenerator = (
  svgProcessor: SvgProcessor,
  indexWriter: IndexStreamWriter,
  metadataWriter: MetadataStreamWriter,
): FileGenerator => {
  return new FileGenerator(svgProcessor, indexWriter, metadataWriter);
};
