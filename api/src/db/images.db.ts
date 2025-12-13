import { pgTable, varchar, serial, integer } from "drizzle-orm/pg-core";
import { pets } from "./pets.db";

export const images = pgTable("images", {
  id: serial().primaryKey().notNull(),
  url: varchar().notNull(),
  petId: integer().references(() => pets.id, { onDelete: "cascade" }),
});
