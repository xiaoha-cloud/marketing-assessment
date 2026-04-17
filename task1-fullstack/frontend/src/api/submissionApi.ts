/**
 * Submissions dashboard API (GET /api/submissions).
 */

import { isRecord, parseApiErrorMessage } from "./parseEnvelope.js";
import type { ApiSuccessResponse } from "../types/api.js";
import type { SubmissionListItem } from "../types/submission.js";

export async function fetchSubmissions(): Promise<SubmissionListItem[]> {
  const res = await fetch("/api/submissions", {
    headers: { Accept: "application/json" },
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    throw new Error(parseApiErrorMessage(json));
  }
  if (!isRecord(json) || !Array.isArray(json.data)) {
    throw new Error("Invalid response shape");
  }
  return (json as ApiSuccessResponse<SubmissionListItem[]>).data;
}
