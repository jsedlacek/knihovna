/**
 * Retry utility with exponential backoff for handling network failures and server overloads.
 */

import { range } from "#@/lib/shared/utils/range-utils.ts";

export interface RetryOptions {
  /**
   * Number of retry attempts (default: 3)
   */
  retries?: number;

  /**
   * Initial delay in milliseconds before first retry (default: 1000)
   */
  delay?: number;

  /**
   * Multiplier for exponential backoff (default: 2)
   */
  factor?: number;

  /**
   * Maximum delay in milliseconds to prevent excessive wait times (default: 30000)
   */
  maxDelay?: number;

  /**
   * Callback function called on each retry attempt
   */
  onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Executes a function with retry logic and exponential backoff.
 *
 * @param fn Function to execute that returns a Promise
 * @param options Retry configuration options
 * @returns Promise that resolves with the function's result or rejects with the final error
 *
 * @example
 * ```ts
 * const result = await withRetry(
 *   () => fetch('https://api.example.com/data'),
 *   {
 *     retries: 3,
 *     delay: 1000,
 *     factor: 2,
 *     onRetry: (error, attempt) => console.log(`Retry ${attempt}: ${error.message}`)
 *   }
 * );
 * ```
 */

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    factor = 2,
    maxDelay = 30000,
    onRetry,
  } = options;

  let lastError: Error = new Error("Retry failed");
  let currentDelay = delay;

  for (const attempt of range(retries + 1)) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this was the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }

      // Call the retry callback if provided
      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      // Wait before retrying with exponential backoff
      await sleep(Math.min(currentDelay, maxDelay));
      currentDelay *= factor;
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError;
}

/**
 * Sleep for the specified number of milliseconds.
 *
 * @param ms Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Predefined retry configurations for common scenarios.
 */
export const RETRY_CONFIGS = {
  /**
   * Conservative retry for critical operations
   */
  CONSERVATIVE: {
    retries: 2,
    delay: 2000,
    factor: 2,
    maxDelay: 10000,
  } as RetryOptions,

  /**
   * Standard retry for most network operations
   */
  STANDARD: {
    retries: 3,
    delay: 1000,
    factor: 2,
    maxDelay: 30000,
  } as RetryOptions,

  /**
   * Aggressive retry for resilient operations
   */
  AGGRESSIVE: {
    retries: 5,
    delay: 500,
    factor: 1.5,
    maxDelay: 60000,
  } as RetryOptions,
};
