import "dotenv/config";
import { createServer } from "node:http";
import { app } from "./app.js";
import { loadEnv } from "./config/env.js";
import { seedDb } from "./db/seedDb.js";

async function main(): Promise<void> {
  await seedDb();
  const { port } = loadEnv();
  createServer(app).listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
