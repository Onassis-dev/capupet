import { SQL, sql } from "drizzle-orm";
import { serial, integer, uuid } from "drizzle-orm/pg-core";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { type AnyPgColumn } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  image: text("image"),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  lang: text("lang"),
  theme: text("theme").default("light"),
  permissionId: integer().references(() => permissions.id, {
    onDelete: "set null",
  }),
  fts: varchar().generatedAlwaysAs(
    (): SQL => sql`concat_fts(${users.name}, ${users.email})`
  ),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const organizations = pgTable("organizations", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull().unique(),
  logo: varchar(),
  ownerId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const organizationId = integer()
  .notNull()
  .references(() => organizations.id, { onDelete: "cascade" });

export const permissionsList = {
  users: boolean().default(false).notNull(),
  pets: boolean().default(false).notNull(),
  adopters: boolean().default(false).notNull(),
  tasks: boolean().default(false).notNull(),
  website: boolean().default(false).notNull(),
};

export type Permission = keyof typeof permissionsList;

export const permissions = pgTable(
  "permissions",
  {
    id: serial().primaryKey().notNull(),
    userId: text().references((): AnyPgColumn => users.id, {
      onDelete: "cascade",
    }),
    invitation: uuid().unique(),
    organizationId,
    createdAt: timestamp().notNull().defaultNow(),
    ...permissionsList,
  },

  (table) => [
    uniqueIndex("unique_permission").on(table.userId, table.organizationId),
  ]
);
