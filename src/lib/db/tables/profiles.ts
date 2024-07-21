import { drizzle } from "drizzle-orm/xata-http";
import { eq, InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  pgSchema,
  pgTable,
  primaryKey,
  serial,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { householdsTable } from "./households";
import { expensesTable } from "./expenses";

export const roles = ["user", "admin"] as const;

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

// https://supabase.com/docs/guides/auth/managing-user-data#using-triggers

export const profilesTable = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  fullName: varchar("full_name").notNull(),
  email: varchar("email").notNull().unique(),
  avatarURL: varchar("avatar_url").notNull(),
  role: varchar("role", { enum: roles }).notNull().default("user"),

  householdId: uuid("household_id")
    .notNull()
    .references(() => householdsTable.id, { onDelete: "cascade" }),

  // Timestamps
  // updatedAt: timestamp("updated_at", {
  //   mode: "date",
  //   withTimezone: true,
  // }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  lastSignInAt: timestamp("last_sign_in_at", {
    mode: "date",
    withTimezone: true,
  }),
});

export const profilesRelations = relations(profilesTable, ({ one, many }) => ({
  household: one(householdsTable, {
    fields: [profilesTable.householdId],
    references: [householdsTable.id],
  }),
  expenses: many(expensesTable),

  // Multiple households per user:
  // profilesToHouseholds: many(profilesToHouseholds, {
  //   relationName: "profiles_to_households",
  // }),
}));

export const insertprofileschema = createInsertSchema(profilesTable);
export const selectprofileschema = createSelectSchema(profilesTable);

export type SelectUser = InferSelectModel<typeof profilesTable>;
export type InsertUser = InferInsertModel<typeof profilesTable>;
