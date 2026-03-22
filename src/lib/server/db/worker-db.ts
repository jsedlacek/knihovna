import { drizzle } from "drizzle-orm/sql-js";

let dbInstance: ReturnType<typeof drizzle> | undefined;

async function loadSqliteBuffer(): Promise<Uint8Array> {
  // Load the SQLite file as a Cloudflare static asset.
  // In both dev and production, the file is served from the assets directory.
  const { env } = await import("cloudflare:workers");
  const assets = (env as Record<string, unknown>)["ASSETS"] as {
    fetch: (input: string | Request) => Promise<Response>;
  };

  const response = await assets.fetch(
    new Request("https://assets.local/data/books.sqlite"),
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch books.sqlite: ${response.status} ${response.statusText}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

export async function getWorkerDb() {
  if (dbInstance) return dbInstance;

  // Polyfill self.location for sql.js module-level code
  const g = globalThis as Record<string, unknown>;
  if (typeof g["location"] === "undefined") {
    g["location"] = { href: "" };
  }

  const { default: initSqlJs } = await import("sql.js/dist/sql-asm.js");
  const SQL = await initSqlJs();
  const buffer = await loadSqliteBuffer();
  const sqlDb = new SQL.Database(buffer);

  dbInstance = drizzle(sqlDb, { casing: "snake_case" });
  return dbInstance;
}
