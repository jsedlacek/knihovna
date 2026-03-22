import initSqlJs from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { readFileSync } from "node:fs";

const SQLITE_PATH = new URL("../../../../data/books.sqlite", import.meta.url).pathname;

let dbInstance: ReturnType<typeof drizzle> | undefined;

export async function getWorkerDb() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  const buffer = readFileSync(SQLITE_PATH);
  const sqlDb = new SQL.Database(buffer);
  dbInstance = drizzle(sqlDb, { casing: "snake_case" });
  return dbInstance;
}
