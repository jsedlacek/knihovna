import { drizzle } from "drizzle-orm/sql-js";
// @ts-expect-error -- vite-plugin-arraybuffer import
import sqliteData from "../../../../data/books.sqlite?arraybuffer";

let dbInstance: ReturnType<typeof drizzle> | undefined;

export async function getWorkerDb() {
  if (dbInstance) return dbInstance;

  // Polyfill self.location for sql.js module-level code that accesses
  // self.location.href (undefined in workerd/Cloudflare Workers)
  const g = globalThis as Record<string, unknown>;
  if (typeof g["location"] === "undefined") {
    g["location"] = { href: "" };
  }

  const { default: initSqlJs } = await import("sql.js/dist/sql-asm.js");
  const SQL = await initSqlJs();
  const sqlDb = new SQL.Database(new Uint8Array(sqliteData as ArrayBuffer));
  dbInstance = drizzle(sqlDb, { casing: "snake_case" });
  return dbInstance;
}
