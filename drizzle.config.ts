import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ debug: true, path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  schemaFilter: ["public"],
  out: "./drizzle",
  schema: "./src/lib/db/tables/*",
  dialect: "postgresql",
  migrations: {
    prefix: "index",
  },
  dbCredentials: {
    url: DATABASE_URL,
  },
});
