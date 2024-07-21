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
import { expensesTable } from "./expenses";

export const householdsTable = pgTable("households", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => profilesTable.id, { onDelete: "cascade" }),

  // Timestamps
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const householdsRelations = relations(householdsTable, ({ many }) => ({
  members: many(profilesTable),
  expenses: many(expensesTable),

  // Multiple households per user:
  // profilesToHouseholds: many(profilesToHouseholds, {
  //   relationName: "profiles_to_households",
  // }),
}));

// Multiple households per user:
// export const profilesToHouseholds = pgTable(
//   "profiles_to_households",
//   {
//     userId: uuid("user_id")
//       .notNull()
//       .references(() => profilesTable.id, { onDelete: "cascade" }),
//     householdId: uuid("household_id")
//       .notNull()
//       .references(() => householdsTable.id, { onDelete: "cascade" }),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.userId, t.householdId] }),
//   })
// );

// export const profilesToHouseholdsRelations = relations(
//   profilesToHouseholds,
//   ({ one }) => ({
//     household: one(householdsTable, {
//       fields: [profilesToHouseholds.householdId],
//       references: [householdsTable.id],
//     }),
//     profile: one(profilesTable, {
//       fields: [profilesToHouseholds.userId],
//       references: [profilesTable.id],
//     }),
//   })
// );

export const insertHouseholdSchema = createInsertSchema(householdsTable);
export const selectHouseholdSchema = createSelectSchema(householdsTable);

export type SelectHousehold = InferSelectModel<typeof householdsTable>;
export type InsertHousehold = InferInsertModel<typeof householdsTable>;
