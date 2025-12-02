import {
  pgTable,
  varchar,
  serial,
  boolean,
  time,
  date,
} from "drizzle-orm/pg-core";
import { organizationId } from "./auth.db";
import { sql, SQL } from "drizzle-orm";

export const tasks = pgTable("tasks", {
  id: serial().primaryKey().notNull(),
  title: varchar().notNull(),
  description: varchar(),
  done: boolean().default(false),
  due: date(),
  hour: time(),
  fts: varchar().generatedAlwaysAs(
    (): SQL => sql`concat_fts(${tasks.title}, ${tasks.description})`
  ),
  organizationId,
});
