/* Allow importing SVG files as URL strings (Vite asset imports) */

interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

declare module "*.svg" {
  const metadata: ImageMetadata;
  export default metadata;
}

declare module "*.svg?url" {
  const url: string;
  export default url;
}
