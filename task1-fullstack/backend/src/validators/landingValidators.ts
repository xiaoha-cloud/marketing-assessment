/**
 * Validation for landing lead capture POST bodies.
 */

import type { LandingSubmissionRequest } from "../types/submission.js";
import {
  isNonEmptyAfterTrim,
  isPlausibleEmail,
  isRecord,
  trimString,
} from "./commonValidators.js";

export type LandingSubmissionBodyResult =
  | { ok: true; value: LandingSubmissionRequest }
  | { ok: false; message: string };

export function parseLandingSubmissionRequest(
  body: unknown,
): LandingSubmissionBodyResult {
  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be a JSON object" };
  }

  const firstName = trimString(body.firstName);
  const lastName = trimString(body.lastName);
  const email = trimString(body.email);
  const company = trimString(body.company);

  if (!isNonEmptyAfterTrim(body.firstName)) {
    return { ok: false, message: "firstName is required" };
  }
  if (!isNonEmptyAfterTrim(body.lastName)) {
    return { ok: false, message: "lastName is required" };
  }
  if (!isNonEmptyAfterTrim(body.email)) {
    return { ok: false, message: "email is required" };
  }
  if (!isPlausibleEmail(email)) {
    return { ok: false, message: "email must be a valid address" };
  }
  if (!isNonEmptyAfterTrim(body.company)) {
    return { ok: false, message: "company is required" };
  }

  return {
    ok: true,
    value: { firstName, lastName, email, company },
  };
}
