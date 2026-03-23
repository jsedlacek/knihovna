/**
 * Generates a Cloudflare Image Transformation URL for a book cover image.
 * Uses /cdn-cgi/image/ to resize, optimize format (WebP/AVIF), and cache at edge.
 * In dev, returns the original URL since /cdn-cgi/image/ is only available in production.
 */
export function getImageUrl(
  src: string,
  opts: { width?: number | undefined; height?: number | undefined },
): string {
  if (import.meta.env.DEV) {
    return src;
  }

  const params = [
    opts.width && `width=${opts.width}`,
    opts.height && `height=${opts.height}`,
    "fit=cover",
    "format=auto",
    "quality=80",
  ]
    .filter(Boolean)
    .join(",");

  return `/cdn-cgi/image/${params}/${src}`;
}
