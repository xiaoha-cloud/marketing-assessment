export type AppEnv = {
  port: number;
};

export function loadEnv(): AppEnv {
  const raw = process.env.PORT;
  const port = raw !== undefined && raw !== "" ? Number(raw) : 3000;
  if (Number.isNaN(port) || port <= 0) {
    throw new Error("Invalid PORT");
  }
  return { port };
}
