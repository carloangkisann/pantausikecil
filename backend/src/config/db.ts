import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';
import { ENV } from "./env.js";
import * as schema from "../db/schema.js";

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});

export const db = drizzle(pool, { schema });