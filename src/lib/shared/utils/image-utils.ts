/**
 * Generates a Cloudflare Image Transformation URL for a book cover image.
 * Uses /cdn-cgi/image/ to resize, optimize format (WebP/AVIF), and cache at edge.
 * In dev, returns the original URL since /cdn-cgi/image/ is only available in production.
 */
export function getImageUrl(src: string, opts: { width: number; height: number }): string {
  if (import.meta.env.DEV) {
    return src;
  }
  return `/cdn-cgi/image/width=${opts.width},height=${opts.height},fit=cover,format=auto,quality=80/${src}`;
}
