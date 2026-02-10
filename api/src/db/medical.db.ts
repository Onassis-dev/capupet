import {
  pgTable,
  serial,
  timestamp,
  integer,
  date,
  text,
} from "drizzle-orm/pg-core";
import { pets } from "./pets.db";
import { medicalOptions } from "./medicalOptions";

export const medical = pgTable("medical", {
  id: serial().primaryKey().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  date: date().notNull(),
  notes: text(),
  medicalOptionId: integer()
    .notNull()
    .references(() => medicalOptions.id, {
      onDelete: "restrict",
    }),
  petId: integer()
    .notNull()
    .references(() => pets.id, { onDelete: "cascade" }),
});
