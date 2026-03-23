const PROD_ORIGIN = "https://knihovna.jakub.contact";

/**
 * Generates a Cloudflare Image Transformation URL for a book cover image.
 * Uses /cdn-cgi/image/ to resize, optimize format (WebP/AVIF), and cache at edge.
 * In dev, proxies through the production domain since /cdn-cgi/image/ is only available there.
 */
export function getImageUrl(
  src: string,
  opts: { width?: number | undefined; height?: number | undefined },
): string {
  const params = [
    opts.width && `width=${opts.width}`,
    opts.height && `height=${opts.height}`,
    "fit=cover",
    "format=auto",
    "quality=80",
  ]
    .filter(Boolean)
    .join(",");

  const prefix = import.meta.env.DEV ? PROD_ORIGIN : "";
  return `${prefix}/cdn-cgi/image/${params}/${src}`;
}
