const IMAGE_PROXY_ENABLED =
  !import.meta.env.DEV && import.meta.env["VITE_IMAGE_PROXY_ENABLED"] !== "false";
const IMAGE_PROXY_URL = import.meta.env["VITE_IMAGE_PROXY_URL"] || "/cdn-cgi/image";

/**
 * Generates a Cloudflare Image Transformation URL for a book cover image.
 * Uses /cdn-cgi/image/ to resize, optimize format (WebP/AVIF), and cache at edge.
 *
 * Configure via env vars:
 *   VITE_IMAGE_PROXY_ENABLED=false  — bypass proxy, return original URLs
 *   VITE_IMAGE_PROXY_URL=...        — override the proxy base path
 */
export function getImageUrl(
  src: string,
  opts: { width?: number | undefined; height?: number | undefined },
): string {
  if (!IMAGE_PROXY_ENABLED) {
    return src;
  }

  const fit = opts.width && opts.height ? "fit=cover" : "fit=scale-down";
  const params = [
    opts.width && `width=${opts.width}`,
    opts.height && `height=${opts.height}`,
    fit,
    "format=auto",
    "quality=80",
  ]
    .filter(Boolean)
    .join(",");

  return `${IMAGE_PROXY_URL}/${params}/${src}`;
}
