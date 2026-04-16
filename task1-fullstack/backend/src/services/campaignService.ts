/**
 * Campaign read workflows: compose campaigns with child events from repositories.
 */

import * as campaignRepository from "../repositories/campaignRepository.js";
import * as eventRepository from "../repositories/eventRepository.js";
import { mapCampaignRow, mapEventRow } from "../utils/mapper.js";
import type { CampaignRow, CampaignWithEvents } from "../types/campaign.js";

function toCampaignWithEvents(row: CampaignRow): CampaignWithEvents {
  const campaign = mapCampaignRow(row);
  const eventRows = eventRepository.findByCampaignId(row.id);
  const events = eventRows.map(mapEventRow);
  return { ...campaign, events };
}

export function getAllCampaigns(): CampaignWithEvents[] {
  return campaignRepository.findAll().map(toCampaignWithEvents);
}

export function getCampaignById(id: number): CampaignWithEvents | null {
  const row = campaignRepository.findById(id);
  if (row === null) {
    return null;
  }
  return toCampaignWithEvents(row);
}
