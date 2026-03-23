import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";
import { configureLogging, createLogger } from "#@/lib/server/utils/logger.ts";

await configureLogging();

const log = createLogger("server");
const handler = createStartHandler(defaultStreamHandler);

const SITE_URL = "https://knihovna.jakub.contact";

const GENRE_PATHS = ["beletrie", "poezie", "divadlo", "deti", "ostatni"];

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data: https://web2.mlp.cz; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

function handleRobotsTxt(): Response {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function handleSitemapXml(): Response {
  const urls = [SITE_URL, ...GENRE_PATHS.map((genre) => `${SITE_URL}/${genre}`)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

function addSecurityHeaders(response: Response): Response {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export default createServerEntry({
  async fetch(...args) {
    const request = args[0];
    const url = new URL(request.url);
    const start = Date.now();

    let response: Response;

    if (url.pathname === "/robots.txt") {
      response = addSecurityHeaders(handleRobotsTxt());
    } else if (url.pathname === "/sitemap.xml") {
      response = addSecurityHeaders(handleSitemapXml());
    } else {
      try {
        response = addSecurityHeaders(await handler(...args));
      } catch (error) {
        log.error("Unhandled request error", {
          method: request.method,
          path: url.pathname,
          error,
        });
        throw error;
      }
    }

    if (response.status >= 500) {
      log.error("Request returned server error", {
        method: request.method,
        path: url.pathname,
        status: response.status,
        duration: Date.now() - start,
      });
    } else {
      log.info("Request handled", {
        method: request.method,
        path: url.pathname,
        status: response.status,
        duration: Date.now() - start,
      });
    }

    return response;
  },
});
