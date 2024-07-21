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

export const addExpenseFormSchema = z.object({
  title: z
    .string({
      required_error: "Tytuł wydatku jest wymagany",
      invalid_type_error: "Nieprawidłowy wydatek",
    })
    .min(1, "Brak tytułu wydatku"),
  description: z
    .string({ invalid_type_error: "Nieprawidłowy opis wydatku" })
    .optional(),
  amount: z.coerce
    .number({
      required_error: "Kwota wydatku jest wymagana",
      invalid_type_error: "Nieprawidłowa kwota wydatku",
    })
    .min(0, "Kwota wydatku nie może być ujemna"),
  householdId: z
    .string({
      required_error: "Domostwo jest wymagane",
      invalid_type_error: "Nieprawidłowe ID domostwa",
    })
    .min(1, "Nieprawidłowe ID domostwa"),
});

export type AddExpenseForm = z.infer<typeof addExpenseFormSchema>;

export type SelectExpense = InferSelectModel<typeof expensesTable>;
export type InsertExpense = InferInsertModel<typeof expensesTable>;
