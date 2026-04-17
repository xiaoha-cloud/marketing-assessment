/**
 * Landing campaign lookup (GET /api/landing/:slug) and lead submit (POST).
 */

import { isRecord, parseApiErrorCode, parseApiErrorMessage } from "./parseEnvelope.js";
import type { ApiSuccessResponse } from "../types/api.js";
import type { CampaignLandingView } from "../types/campaign.js";
import type { LandingSubmissionRequest } from "../types/submission.js";

export async function fetchLandingCampaign(
  slug: string,
): Promise<CampaignLandingView> {
  const encoded = encodeURIComponent(slug);
  const res = await fetch(`/api/landing/${encoded}`, {
    headers: { Accept: "application/json" },
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    throw new Error(parseApiErrorMessage(json));
  }
  if (!isRecord(json) || !isRecord(json.data)) {
    throw new Error("Invalid response shape");
  }
  return (json as ApiSuccessResponse<CampaignLandingView>).data;
}

export class LandingSubmitError extends Error {
  readonly code: string | undefined;

  constructor(code: string | undefined, message: string) {
    super(message);
    this.name = "LandingSubmitError";
    this.code = code;
  }
}

export async function submitLandingLead(
  slug: string,
  body: LandingSubmissionRequest,
): Promise<{ id: number }> {
  const encoded = encodeURIComponent(slug);
  const res = await fetch(`/api/landing/${encoded}/submit`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    const code = parseApiErrorCode(json);
    throw new LandingSubmitError(code, parseApiErrorMessage(json));
  }
  if (!isRecord(json) || !isRecord(json.data) || typeof json.data.id !== "number") {
    throw new Error("Invalid response shape");
  }
  return { id: json.data.id as number };
}
