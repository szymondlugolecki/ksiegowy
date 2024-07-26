import { drizzle } from "drizzle-orm/xata-http";
import { eq, InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { householdsTable } from "./households";
import { string, z } from "zod";

// const CATEGORIES = ["transport", "food", "entertainment", "other"] as const;

export const expensesTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title").notNull(),
  amount: integer("amount").notNull(),
  description: varchar("description"),

  householdId: uuid("household_id")
    .notNull()
    .references(() => householdsTable.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profilesTable.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  household: one(householdsTable, {
    fields: [expensesTable.householdId],
    references: [householdsTable.id],
  }),
  user: one(profilesTable, {
    fields: [expensesTable.profileId],
    references: [profilesTable.id],
  }),
}));

export const insertExpenseSchema = createInsertSchema(expensesTable);
export const selectExpenseSchema = createSelectSchema(expensesTable);

export type SelectExpense = InferSelectModel<typeof expensesTable>;
export type InsertExpense = InferInsertModel<typeof expensesTable>;
