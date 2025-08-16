import {
  USER_AGENT,
  ACCEPT_LANGUAGE,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
} from "#@/lib/shared/config/scraper-config.ts";

/**
 * A simple fetch wrapper with a user-agent header and basic retry logic.
 */
export async function fetchHtml(
  url: string,
  retries = RETRY_ATTEMPTS,
  delay = RETRY_DELAY,
): Promise<string> {
  for (const i of Array.from({ length: retries }, (_, index) => index)) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          "Accept-Language": ACCEPT_LANGUAGE,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${url}`);
      }
      return await response.text();
    } catch (error) {
      if (i === retries - 1) {
        console.error(
          `Failed to fetch ${url} after ${retries} attempts:`,
          error,
        );
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * 2 ** i));
    }
  }
  throw new Error(`Failed to fetch ${url}`);
}

/**
 * Creates a URL by joining a base URL with a relative path.
 */
export function createUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).href;
}
