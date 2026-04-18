/**
 * Helpers for API success/error JSON envelopes.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseApiErrorMessage(json: unknown): string {
  if (!isRecord(json)) {
    return "Request failed";
  }
  const err = json.error;
  if (!isRecord(err) || typeof err.message !== "string") {
    return "Request failed";
  }
  return err.message;
}

export function parseApiErrorCode(json: unknown): string | undefined {
  if (!isRecord(json)) {
    return undefined;
  }
  const err = json.error;
  if (!isRecord(err) || typeof err.code !== "string") {
    return undefined;
  }
  return err.code;
}
