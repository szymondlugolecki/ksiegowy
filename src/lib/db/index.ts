import { drizzle } from "drizzle-orm/xata-http";
import { eq } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { getXataClient } from "./xata";

const xata = getXataClient();

export const db = drizzle(xata);
