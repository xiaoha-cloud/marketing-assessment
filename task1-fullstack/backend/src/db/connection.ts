/**
 * Database connection helpers live here.
 * Implementation is added in the database initialization phase.
 */

export function getDbPath(): string {
  return process.env.DATABASE_PATH ?? "data/app.db";
}
