/**
 * SQLite connection: single shared handle, database directory creation.
 */

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

let db: Database.Database | null = null;

export function getDbPath(): string {
  return process.env.DATABASE_PATH ?? "data/app.db";
}

function resolveDbFilePath(): string {
  return resolve(process.cwd(), getDbPath());
}

/**
 * Returns the shared SQLite connection, opening it on first use.
 */
export function getDb(): Database.Database {
  if (db !== null) {
    return db;
  }
  const filePath = resolveDbFilePath();
  mkdirSync(dirname(filePath), { recursive: true });
  const handle = new Database(filePath);
  handle.pragma("foreign_keys = ON");
  db = handle;
  return db;
}
