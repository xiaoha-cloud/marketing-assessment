/**
 * Campaign read API client (expects Vite dev proxy to backend on /api).
 */

import type { ApiSuccessResponse } from "../types/api.js";
import type { CampaignWithEvents } from "../types/campaign.js";

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

export async function fetchCampaigns(): Promise<CampaignWithEvents[]> {
  const res = await fetch("/api/campaigns", {
    headers: { Accept: "application/json" },
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    const message = parseApiError(json);
    throw new Error(message);
  }
  if (!isRecord(json) || !Array.isArray(json.data)) {
    throw new Error("Invalid response shape");
  }
  return (json as ApiSuccessResponse<CampaignWithEvents[]>).data;
}
