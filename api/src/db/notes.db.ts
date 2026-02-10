import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./auth.db";
import { pets } from "./pets.db";

export const notes = pgTable("notes", {
  id: serial().primaryKey().notNull(),
  content: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  creatorId: text().references(() => users.id, { onDelete: "set null" }),
  petId: integer()
    .notNull()
    .references(() => pets.id, { onDelete: "cascade" }),
});
