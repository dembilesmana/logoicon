import { logger } from "@logoicon/logger";
import { QueueItem } from "../types/generation.types";

/**
 * A concurrency limiter that controls the number of parallel operations
 */
export class ConcurrencyLimiter {
  private active = 0;
  private queue: QueueItem[] = [];

  constructor(private readonly limit: number) {
    if (limit <= 0) {
      throw new Error(`Concurrency limit must be greater than 0, got: ${limit}`);
    }
  }

  /**
   * Execute a function with concurrency control
   */
  async run<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        fn: fn as () => Promise<unknown>,
        resolve: (value: unknown) => resolve(value as T),
        reject: (error: unknown) => reject(error),
      });
      this.processNext();
    });
  }

  /**
   * Wait until all active and queued tasks are completed
   */
  async onIdle(): Promise<void> {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (this.active === 0 && this.queue.length === 0) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }

  /**
   * Get current statistics
   */
  getStats() {
    return {
      active: this.active,
      queued: this.queue.length,
      limit: this.limit,
    };
  }

  /**
   * Process the next item in the queue if under the limit
   */
  private processNext(): void {
    if (this.active >= this.limit || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.active++;

    logger.debug('Starting task', this.getStats());

    job
      .fn()
      .then((value) => {
        job.resolve(value);
      })
      .catch((error) => {
        logger.error('Task failed', { error, stats: this.getStats() });
        job.reject(error);
      })
      .finally(() => {
        this.active--;
        logger.debug('Task completed', this.getStats());
        this.processNext();
      });
  }
}

/**
 * Create a concurrency limiter with the specified limit
 */
export const createConcurrencyLimiter = (limit: number): ConcurrencyLimiter => {
  return new ConcurrencyLimiter(limit);
};
