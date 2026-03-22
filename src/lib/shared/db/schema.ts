import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const booksTable = sqliteTable("books", {
  titulKey: integer().primaryKey(),
  title: text().notNull(),
  author: text().notNull(),
  publisher: text(),
  year: integer(),
  detailUrl: text().notNull(),
  subtitle: text(),
  partTitle: text(),
  imageUrl: text(),
  description: text(),
  pdfUrl: text(),
  epubUrl: text(),
  genreId: text(),
  genre: text(),
  rating: real(),
  ratingsCount: integer(),
  url: text(),
  mlpScrapedAt: text(),
  goodreadsScrapedAt: text(),
});
