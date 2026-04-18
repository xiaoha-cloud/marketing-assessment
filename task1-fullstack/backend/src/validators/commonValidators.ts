/**
 * Shared string and structure checks for request bodies.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function trimString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function isNonEmptyAfterTrim(value: unknown): boolean {
  return trimString(value) !== "";
}

/**
 * Minimal email shape check (no full RFC validation).
 */
export function isPlausibleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
