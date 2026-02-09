import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { pets } from "./pets.db";

export const files = pgTable("files", {
  id: serial().primaryKey().notNull(),
  url: text().notNull(),
  size: integer(),
  name: text().notNull(),
  extension: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  petId: integer().references(() => pets.id, { onDelete: "cascade" }),
});
