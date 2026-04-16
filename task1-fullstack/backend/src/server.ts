import { createServer } from "node:http";
import { app } from "./app.js";
import { loadEnv } from "./config/env.js";

const { port } = loadEnv();

createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
