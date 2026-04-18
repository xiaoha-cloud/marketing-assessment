/**
 * Apply SQLite schema from schema.sql on startup.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "./connection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function initDb(): Promise<void> {
  const schemaPath = join(__dirname, "schema.sql");
  const sql = readFileSync(schemaPath, "utf8");
  getDb().exec(sql);
}
