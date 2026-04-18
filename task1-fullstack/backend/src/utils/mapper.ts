/**
 * Explicit row-to-domain mapping for SQLite snake_case columns to API models.
 */

import type { Campaign, CampaignRow } from "../types/campaign.js";
import type { Event, EventRow } from "../types/event.js";
import type {
  Submission,
  SubmissionListItem,
  SubmissionListJoinRow,
  SubmissionRow,
} from "../types/submission.js";

export function mapCampaignRow(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    emailSubject: row.email_subject,
    ctaText: row.cta_text,
    status: row.status,
    platform: row.platform,
    budgetUsd: row.budget_usd,
    createdAt: row.created_at,
  };
}

export function mapEventRow(row: EventRow): Event {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    eventDate: row.event_date,
    location: row.location,
    capacity: row.capacity,
    description: row.description,
  };
}

export function mapSubmissionRow(row: SubmissionRow): Submission {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    company: row.company,
    submittedAt: row.submitted_at,
  };
}

export function mapSubmissionListJoinRow(row: SubmissionListJoinRow): SubmissionListItem {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    campaignName: row.campaign_name,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    company: row.company,
    submittedAt: row.submitted_at,
  };
}
