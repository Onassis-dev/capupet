import { pgTable, boolean, varchar, serial } from "drizzle-orm/pg-core";
import { organizationId } from "./auth.db";

export const websites = pgTable("websites", {
  id: serial().primaryKey().notNull(),
  url: varchar().notNull(),
  active: boolean().notNull().default(false),
  description: varchar(),
  language: varchar().notNull(),
  organizationId,
});
