export type AppEnv = {
  port: number;
  landingBaseUrl: string;
};

function resolvePort(): number {
  const raw = process.env.PORT;
  const port = raw !== undefined && raw !== "" ? Number(raw) : 3000;
  if (Number.isNaN(port) || port <= 0) {
    throw new Error("Invalid PORT");
  }
  return port;
}

function resolveLandingBaseUrl(): string {
  const raw = process.env.LANDING_BASE_URL;
  if (raw === undefined || raw.trim() === "") {
    return "http://localhost:5173";
  }
  return raw.trim().replace(/\/$/, "");
}

export function loadEnv(): AppEnv {
  return {
    port: resolvePort(),
    landingBaseUrl: resolveLandingBaseUrl(),
  };
}

/** Public origin used in outbound email links (no trailing slash). */
export function getLandingBaseUrl(): string {
  return resolveLandingBaseUrl();
}
