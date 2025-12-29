import { ACCEPT_LANGUAGE, USER_AGENT } from "#@/lib/shared/config/scraper-config.ts";

/**
 * A simple fetch wrapper with a user-agent header.
 */
export async function fetchHtml(url: string): Promise<string> {
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
}

/**
 * Creates a URL by joining a base URL with a relative path.
 */
export function createUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).href;
}
