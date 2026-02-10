import {
  pgTable,
  varchar,
  serial,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { organizationId } from "./auth.db";
import { sql, SQL } from "drizzle-orm";

export const medicalTypesArray = ["vaccine", "procedure"] as const;

export const medicalTypes = pgEnum("medicalTypes", medicalTypesArray);

export const medicalOptions = pgTable("medicalOptions", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  description: varchar(),
  type: medicalTypes().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  fts: varchar().generatedAlwaysAs(
    (): SQL =>
      sql`concat_fts(${medicalOptions.name}, ${medicalOptions.description})`
  ),
  organizationId,
});
