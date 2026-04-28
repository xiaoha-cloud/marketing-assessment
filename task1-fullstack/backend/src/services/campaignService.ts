/**
 * Campaign read workflows: compose campaigns with child events from repositories.
 */

import * as campaignRepository from "../repositories/campaignRepository.js";
import * as eventRepository from "../repositories/eventRepository.js";
import * as emailService from "./emailService.js";
import { buildLandingUrl } from "../utils/buildLandingUrl.js";
import { isPlausibleEmail } from "../validators/commonValidators.js";
import { mapCampaignRow, mapEventRow } from "../utils/mapper.js";
import type {
  CampaignLandingView,
  CampaignRow,
  CampaignWithEvents,
} from "../types/campaign.js";

export type SendCampaignEmailOutcome =
  | {
      ok: true;
      previewUrl?: string;
      landingUrl: string;
      messageId?: string;
    }
  | {
      ok: false;
      code: "CAMPAIGN_NOT_FOUND" | "INVALID_RECIPIENT_EMAIL" | "EMAIL_SEND_FAILED";
      message: string;
    };

async function toCampaignWithEvents(row: CampaignRow): Promise<CampaignWithEvents> {
  const campaign = mapCampaignRow(row);
  const eventRows = await eventRepository.findByCampaignId(row.id);
  const events = eventRows.map(mapEventRow);
  return { ...campaign, events };
}

export async function getAllCampaigns(): Promise<CampaignWithEvents[]> {
  const rows = await campaignRepository.findAll();
  return Promise.all(rows.map(toCampaignWithEvents));
}

export async function getCampaignById(id: number): Promise<CampaignWithEvents | null> {
  const row = await campaignRepository.findById(id);
  if (row === null) {
    return null;
  }
  return toCampaignWithEvents(row);
}

/**
 * Public landing payload: resolve by slug and attach events (no internal-only fields).
 */
export async function getLandingCampaignBySlug(slug: string): Promise<CampaignLandingView | null> {
  const trimmed = slug.trim();
  if (trimmed === "") {
    return null;
  }
  const row = await campaignRepository.findBySlug(trimmed);
  if (row === null) {
    return null;
  }
  const campaign = mapCampaignRow(row);
  const eventRows = await eventRepository.findByCampaignId(row.id);
  const events = eventRows.map(mapEventRow);
  return {
    id: campaign.id,
    name: campaign.name,
    slug: campaign.slug,
    description: campaign.description,
    ctaText: campaign.ctaText,
    events,
  };
}

export async function sendCampaignEmail(
  campaignId: number,
  recipientEmail: string,
): Promise<SendCampaignEmailOutcome> {
  const trimmed = recipientEmail.trim();
  if (!isPlausibleEmail(trimmed)) {
    return {
      ok: false,
      code: "INVALID_RECIPIENT_EMAIL",
      message: "recipientEmail must be a valid email address",
    };
  }
  const row = await campaignRepository.findById(campaignId);
  if (row === null) {
    return {
      ok: false,
      code: "CAMPAIGN_NOT_FOUND",
      message: "Campaign not found",
    };
  }
  let landingUrl: string;
  try {
    landingUrl = buildLandingUrl(row.slug);
  } catch {
    return {
      ok: false,
      code: "EMAIL_SEND_FAILED",
      message: "Unable to build landing page URL for this campaign",
    };
  }
  const result = await emailService.sendCampaignEmail({
    campaignRow: row,
    recipientEmail: trimmed,
    landingUrl,
  });
  if (!result.ok) {
    return { ok: false, code: "EMAIL_SEND_FAILED", message: result.message };
  }
  return {
    ok: true,
    previewUrl: result.previewUrl,
    landingUrl,
    messageId: result.messageId,
  };
}
