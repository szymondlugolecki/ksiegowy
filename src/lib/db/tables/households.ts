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
import { nanoid } from "nanoid";

export const householdsTable = pgTable("households", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),

  invitationCode: varchar("invitation_code")
    .notNull()
    .$defaultFn(() => nanoid(10)),

  ownerId: uuid("owner_id").notNull(),
  // .references(() => profilesTable.id, { onDelete: "cascade" }),

  // Timestamps
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const householdsRelations = relations(
  householdsTable,
  ({ one, many }) => ({
    owner: one(profilesTable, {
      fields: [householdsTable.ownerId],
      references: [profilesTable.id],
    }),
    expenses: many(expensesTable),
    // Single household per user:
    // members: many(profilesTable),

    // Multiple households per user:
    members: many(members, {
      relationName: "profiles_to_households",
    }),
  })
);

// Multiple households per user:
export const members = pgTable(
  "members",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profilesTable.id, { onDelete: "cascade" }),
    householdId: uuid("household_id")
      .notNull()
      .references(() => householdsTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.householdId] }),
  })
);

export const membersRelations = relations(members, ({ one }) => ({
  household: one(householdsTable, {
    fields: [members.householdId],
    references: [householdsTable.id],
  }),
  profile: one(profilesTable, {
    fields: [members.userId],
    references: [profilesTable.id],
  }),
}));

export const insertHouseholdSchema = createInsertSchema(householdsTable);
export const selectHouseholdSchema = createSelectSchema(householdsTable);

export type SelectHousehold = InferSelectModel<typeof householdsTable>;
export type InsertHousehold = InferInsertModel<typeof householdsTable>;

export const insertHouseholdUserSchema = createInsertSchema(members);
export const selectHouseholdUserSchema = createSelectSchema(members);

export type SelectHouseholdUser = InferSelectModel<typeof members>;
export type InsertHouseholdUser = InferInsertModel<typeof members>;
