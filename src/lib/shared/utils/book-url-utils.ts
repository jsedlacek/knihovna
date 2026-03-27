import { formatAuthorName } from "./text-utils.ts";

/**
 * Create a slug from a title for use in URLs.
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getBookDetailPath(book: { title: string; titulKey: number }): string {
  return `/kniha/${createSlug(book.title)}-${book.titulKey}`;
}

export function parseTitulKeyFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  const value = match?.[1];
  return value ? Number.parseInt(value, 10) : null;
}

export function getAuthorSlug(author: string): string {
  return createSlug(formatAuthorName(author));
}

export function getAuthorDetailPath(authorSlug: string): string {
  return `/autor/${authorSlug}`;
}
