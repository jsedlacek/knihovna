/**
 * Efficient range utilities using generators for modern iteration patterns.
 * These generators provide memory-efficient alternatives to Array.from() approaches.
 */

/**
 * Generator for efficient numeric range iteration (0 to n-1).
 *
 * @param n - The upper bound (exclusive)
 * @yields Numbers from 0 to n-1
 *
 * @example
 * ```ts
 * for (const i of range(5)) {
 *   console.log(i); // 0, 1, 2, 3, 4
 * }
 * ```
 */
export function* range(n: number): Generator<number> {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}

/**
 * Generator for efficient numeric range iteration (start to end-1).
 *
 * @param start - The starting value (inclusive)
 * @param end - The ending value (exclusive)
 * @yields Numbers from start to end-1
 *
 * @example
 * ```ts
 * for (const i of rangeFromTo(2, 7)) {
 *   console.log(i); // 2, 3, 4, 5, 6
 * }
 * ```
 */
export function* rangeFromTo(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}
