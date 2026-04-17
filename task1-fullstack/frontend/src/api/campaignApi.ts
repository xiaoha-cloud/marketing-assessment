/**
 * Campaign read API client (expects Vite dev proxy to backend on /api).
 */

import { isRecord, parseApiErrorMessage } from "./parseEnvelope.js";
import type { ApiSuccessResponse } from "../types/api.js";
import type { CampaignWithEvents } from "../types/campaign.js";

export async function fetchCampaigns(): Promise<CampaignWithEvents[]> {
  const res = await fetch("/api/campaigns", {
    headers: { Accept: "application/json" },
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    throw new Error(parseApiErrorMessage(json));
  }
  if (!isRecord(json) || !Array.isArray(json.data)) {
    throw new Error("Invalid response shape");
  }
  return (json as ApiSuccessResponse<CampaignWithEvents[]>).data;
}

export type SendCampaignEmailResponse = {
  previewUrl?: string;
  landingUrl: string;
  messageId?: string;
};

export async function sendCampaignEmail(
  campaignId: number,
  recipientEmail: string,
): Promise<SendCampaignEmailResponse> {
  const res = await fetch(`/api/campaigns/${campaignId}/send`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipientEmail }),
  });
  const json: unknown = await res.json();
  if (!res.ok) {
    throw new Error(parseApiErrorMessage(json));
  }
  if (!isRecord(json) || !isRecord(json.data)) {
    throw new Error("Invalid response shape");
  }
  const data = json.data;
  const landingUrl = data.landingUrl;
  if (typeof landingUrl !== "string") {
    throw new Error("Invalid response shape");
  }
  return {
    landingUrl,
    previewUrl: typeof data.previewUrl === "string" ? data.previewUrl : undefined,
    messageId: typeof data.messageId === "string" ? data.messageId : undefined,
  };
}
