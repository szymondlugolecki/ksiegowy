import { drizzle } from "drizzle-orm/xata-http";
import { eq } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
});
