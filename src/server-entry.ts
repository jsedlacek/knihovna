import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler(defaultStreamHandler);

const SITE_URL = "https://knihovna.jakub.contact";

const GENRE_PATHS = ["beletrie", "poezie", "divadlo", "deti", "ostatni"];

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' https://web2.mlp.cz; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'",
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

export default {
  async fetch(...args: Parameters<typeof handler>): Promise<Response> {
    const request = args[0];
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt") {
      return addSecurityHeaders(handleRobotsTxt());
    }
    if (url.pathname === "/sitemap.xml") {
      return addSecurityHeaders(handleSitemapXml());
    }

    const response = await handler(...args);
    return addSecurityHeaders(response);
  },
};
