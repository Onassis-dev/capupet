import {
  numeric,
  pgTable,
  varchar,
  serial,
  pgEnum,
  date,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { organizationId } from "./auth.db";
import { sql, SQL } from "drizzle-orm";
import { adopters } from "./adopters.db";

export const speciesArray = ["dog", "cat", "other"] as const;
export const sexesArray = ["male", "female", "unknown"] as const;
export const statusArray = [
  "available",
  "adopted",
  "deceased",
  "intake",
] as const;
export const sizeArray = ["small", "medium", "large", "extraLarge"] as const;
export const measurementsArray = ["Kgs", "Lbs"] as const;

export const species = pgEnum("species", speciesArray);
export const sexes = pgEnum("sexes", sexesArray);
export const status = pgEnum("status", statusArray);
export const size = pgEnum("size", sizeArray);
export const measurements = pgEnum("measurements", measurementsArray);

export const pets = pgTable("pets", {
  id: serial().primaryKey().notNull(),
  species: species().notNull(),
  sex: sexes().notNull(),
  name: varchar().notNull(),
  status: status().notNull(),
  size: size(),
  weight: numeric({ precision: 8, scale: 2 }),
  measurement: measurements(),
  comments: varchar(),
  publicDescription: varchar(),
  admissionDate: date(),
  bornDate: date(),
  public: boolean().notNull().default(true),
  image: varchar(),
  microchip: varchar(),
  adopterId: integer().references(() => adopters.id, { onDelete: "restrict" }),
  fts: varchar().generatedAlwaysAs((): SQL => sql`concat_fts(${pets.name})`),
  organizationId,
});
