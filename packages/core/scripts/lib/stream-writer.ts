import { once } from "node:events";
import { logger } from "@logoicon/logger";
import { FileProcessingError } from "../types/generation.types";

/**
 * A stream writer that handles backpressure and serializes writes
 */
export class StreamWriter {
  private writeChain = Promise.resolve();
  private isClosed = false;

  constructor(private readonly stream: NodeJS.WritableStream) {}

  /**
   * Write data to the stream with backpressure handling
   */
  async write(data: string | Buffer): Promise<void> {
    if (this.isClosed) {
      throw new FileProcessingError("Cannot write to closed stream", "stream");
    }

    // Serialize writes to prevent race conditions
    this.writeChain = this.writeChain.then(() => this.writeChunk(data));
    return this.writeChain;
  }

  /**
   * Close the stream and wait for all writes to complete
   */
  async close(): Promise<void> {
    if (this.isClosed) {
      return;
    }

    // Wait for all pending writes to complete
    await this.writeChain;

    this.isClosed = true;

    return new Promise<void>((resolve, reject) => {
      this.stream.end((error?: Error) => {
        if (error) {
          logger.error(error, "Error closing stream");
          reject(
            new FileProcessingError("Failed to close stream", "stream", error),
          );
        } else {
          logger.debug("Stream closed successfully");
          resolve();
        }
      });
    });
  }

  /**
   * Write a single chunk with backpressure handling
   */
  private async writeChunk(chunk: string | Buffer): Promise<void> {
    if (this.isClosed) {
      throw new FileProcessingError("Cannot write to closed stream", "stream");
    }

    try {
      const needsDrain = !this.stream.write(chunk);

      if (needsDrain) {
        logger.debug("Stream backpressure detected, waiting for drain");
        await once(this.stream, "drain");
        logger.debug("Stream drained, continuing writes");
      }
    } catch (error) {
      logger.error(error, "Error writing to stream");
      throw new FileProcessingError(
        "Failed to write to stream",
        "stream",
        error as Error,
      );
    }
  }

  /**
   * Get the underlying stream (for advanced use cases)
   */
  getStream(): NodeJS.WritableStream {
    return this.stream;
  }

  /**
   * Check if the stream is closed
   */
  get closed(): boolean {
    return this.isClosed;
  }
}

/**
 * Specialized stream writer for index exports
 */
export class IndexStreamWriter extends StreamWriter {
  async writeExport(exportContent: string): Promise<void> {
    await this.write(exportContent);
  }
}

/**
 * Specialized stream writer for metadata NDJSON
 */
export class MetadataStreamWriter extends StreamWriter {
  private isFirstEntry = true;

  async writeMetadataObject(metadata: object): Promise<void> {
    const prefix = this.isFirstEntry ? "  " : "\n  ";
    const json = JSON.stringify(metadata);

    await this.write(prefix);
    await this.write(json);

    this.isFirstEntry = false;
  }
}
