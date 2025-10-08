import { logger } from "@logoicon/logger";
import { XMLParser } from "fast-xml-parser";
import { loadConfig, optimize } from "svgo";
import { FileProcessingError } from "../types/generation.types";
import { readFileWithErrorHandling } from "../utils/file-utils";

/**
 * SVG processing class that handles optimization and parsing
 */
export class SvgProcessor {
  private readonly xmlParser: XMLParser;
  private svgoConfig: any = null;

  constructor() {
    this.xmlParser = new XMLParser({ ignoreAttributes: false });
  }

  /**
   * Initialize the SVG processor by loading SVGO configuration
   */
  async initialize(): Promise<void> {
    try {
      this.svgoConfig = await loadConfig();
      logger.debug("SVGO configuration loaded successfully");
    } catch (error) {
      logger.error(error, "Failed to load SVGO configuration");
      throw new FileProcessingError(
        "Failed to load SVGO configuration",
        "svgo.config.js",
        error as Error,
      );
    }
  }

  /**
   * Process an SVG file: read, optimize, and parse
   */
  async processSvgFile(inputPath: string): Promise<any> {
    if (!this.svgoConfig) {
      throw new FileProcessingError(
        "SVG processor not initialized. Call initialize() first.",
        inputPath,
      );
    }

    try {
      logger.debug({ inputPath }, "Processing SVG file");

      // Read the SVG file
      const xmlData = await readFileWithErrorHandling(inputPath);

      // Optimize the SVG using SVGO
      const optimized = this.optimizeSvg(xmlData);

      // Parse the optimized SVG
      const parsedSvg = this.parseSvg(optimized.data);

      logger.debug(
        {
          inputPath,
          originalSize: xmlData.length,
          optimizedSize: optimized.data.length,
          compressionRatio:
            (
              ((xmlData.length - optimized.data.length) / xmlData.length) *
              100
            ).toFixed(2) + "%",
        },
        "SVG file processed successfully",
      );

      return parsedSvg;
    } catch (error) {
      logger.error({ inputPath, error }, "Failed to process SVG file");

      if (error instanceof FileProcessingError) {
        throw error;
      }

      throw new FileProcessingError(
        `Failed to process SVG file: ${inputPath}`,
        inputPath,
        error as Error,
      );
    }
  }

  /**
   * Optimize SVG content using SVGO
   */
  private optimizeSvg(xmlData: string): { data: string; info?: any } {
    try {
      const result = optimize(xmlData, this.svgoConfig);

      if ("error" in result) {
        throw new Error(String(result.error));
      }

      return result;
    } catch (error) {
      logger.error(error, "SVGO optimization failed");
      throw new FileProcessingError(
        "Failed to optimize SVG with SVGO",
        "svg-content",
        error as Error,
      );
    }
  }

  /**
   * Parse optimized SVG content to JSON
   */
  private parseSvg(svgData: string): any {
    try {
      return this.xmlParser.parse(svgData);
    } catch (error) {
      logger.error(error, "XML parsing failed");
      throw new FileProcessingError(
        "Failed to parse optimized SVG",
        "svg-content",
        error as Error,
      );
    }
  }

  /**
   * Get processor statistics
   */
  getStats() {
    return {
      initialized: this.svgoConfig !== null,
      hasXmlParser: !!this.xmlParser,
    };
  }
}

/**
 * Create and initialize an SVG processor instance
 */
export const createSvgProcessor = async (): Promise<SvgProcessor> => {
  const processor = new SvgProcessor();
  await processor.initialize();
  return processor;
};

/**
 * Utility function to process a single SVG file
 */
export const processSingleSvgFile = async (inputPath: string): Promise<any> => {
  const processor = await createSvgProcessor();
  return processor.processSvgFile(inputPath);
};
