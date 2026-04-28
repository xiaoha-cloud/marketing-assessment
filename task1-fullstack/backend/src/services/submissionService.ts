/**
 * Submission workflows: landing capture and internal listing.
 */

import * as campaignRepository from "../repositories/campaignRepository.js";
import * as submissionRepository from "../repositories/submissionRepository.js";
import { serializeSubmissionExportRows } from "../utils/csv.js";
import type {
  LandingSubmissionRequest,
  SubmissionExportRow,
  SubmissionListItem,
} from "../types/submission.js";

export type CreateLandingSubmissionResult =
  | { ok: true; submissionId: number }
  | { ok: false; code: "CAMPAIGN_NOT_FOUND" };

export async function createLandingSubmission(
  slug: string,
  payload: LandingSubmissionRequest,
): Promise<CreateLandingSubmissionResult> {
  const trimmedSlug = slug.trim();
  if (trimmedSlug === "") {
    return { ok: false, code: "CAMPAIGN_NOT_FOUND" };
  }

  const campaignRow = await campaignRepository.findBySlug(trimmedSlug);
  if (campaignRow === null) {
    return { ok: false, code: "CAMPAIGN_NOT_FOUND" };
  }

  const submissionId = await submissionRepository.create({
    campaignId: campaignRow.id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    company: payload.company,
  });

  return { ok: true, submissionId };
}

export async function getAllSubmissions(): Promise<SubmissionListItem[]> {
  return submissionRepository.findAllWithCampaignName();
}

function submissionListItemToExportRow(item: SubmissionListItem): SubmissionExportRow {
  return {
    id: String(item.id),
    campaignId: String(item.campaignId),
    campaignName: item.campaignName ?? "",
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    company: item.company,
    submittedAt: item.submittedAt,
  };
}

/** CSV body for all submissions (same ordering and source as the dashboard list). */
export async function exportSubmissionsCsv(): Promise<string> {
  const items = await getAllSubmissions();
  const exportRows = items.map(submissionListItemToExportRow);
  return serializeSubmissionExportRows(exportRows);
}
