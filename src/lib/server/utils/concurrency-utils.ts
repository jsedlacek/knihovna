/**
 * Processes an array of items in parallel with a specified concurrency level,
 * preserving the original order of results.
 *
 * @template T - The type of the items to be processed.
 * @template U - The type of the result from the processing function.
 * @param {object} options - The options for batch processing.
 * @param {T[]} options.items - The array of items to process.
 * @param {(item: T) => Promise<U>} options.processItem - The async function to process each item.
 * @param {number} options.concurrency - The number of concurrent workers.
 * @param {(progress: number, total: number, item: T) => void} [options.onProgress] - Optional callback for progress updates.
 * @returns {Promise<U[]>} A promise that resolves to an array of processed results.
 */
export async function processBatch<T, U>({
  items,
  processItem,
  concurrency,
  onProgress,
}: {
  items: T[];
  processItem: (item: T) => Promise<U>;
  concurrency: number;
  onProgress?: (progress: number, total: number, item: T) => void;
}): Promise<U[]> {
  const results: U[] = new Array(items.length);
  // The queue includes the original index to preserve order in the results.
  const queue = items.map((data, index) => ({ data, index }));
  let processedCount = 0;

  const processNext = async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) continue;

      const { data, index } = item;

      // Use a thread-safe counter for progress logging if a callback is provided.
      if (onProgress) {
        processedCount++;
        onProgress(processedCount, items.length, data);
      }

      const result = await processItem(data);
      // The result is placed at its original index, preventing race conditions.
      results[index] = result;
    }
  };

  const workers = Array(concurrency).fill(null).map(processNext);
  await Promise.all(workers);

  return results;
}
