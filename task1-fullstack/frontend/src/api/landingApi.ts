/**
 * Landing campaign lookup (GET /api/landing/:slug).
 */

import type { ApiSuccessResponse } from "../types/api.js";
import type { CampaignLandingView } from "../types/campaign.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseApiError(json: unknown): string {
  if (!isRecord(json)) {
    return "Request failed";
  }
  const err = json.error;
  if (!isRecord(err) || typeof err.message !== "string") {
    return "Request failed";
  }
  return err.message;
}

export async function fetchLandingCampaign(
  slug: string,
): Promise<CampaignLandingView> {
  const encoded = encodeURIComponent(slug);
  const res = await fetch(`/api/landing/${encoded}`, {
    headers: { Accept: "application/json" },
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    throw new Error(parseApiError(json));
  }
  if (!isRecord(json) || !isRecord(json.data)) {
    throw new Error("Invalid response shape");
  }
  return (json as ApiSuccessResponse<CampaignLandingView>).data;
}
