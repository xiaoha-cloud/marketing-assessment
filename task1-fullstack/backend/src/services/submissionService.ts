/**
 * Submission workflows: landing capture and internal listing.
 */

import * as campaignRepository from "../repositories/campaignRepository.js";
import * as submissionRepository from "../repositories/submissionRepository.js";
import type {
  LandingSubmissionRequest,
  SubmissionListItem,
} from "../types/submission.js";

export type CreateLandingSubmissionResult =
  | { ok: true; submissionId: number }
  | { ok: false; code: "CAMPAIGN_NOT_FOUND" };

export function createLandingSubmission(
  slug: string,
  payload: LandingSubmissionRequest,
): CreateLandingSubmissionResult {
  const trimmedSlug = slug.trim();
  if (trimmedSlug === "") {
    return { ok: false, code: "CAMPAIGN_NOT_FOUND" };
  }

  const campaignRow = campaignRepository.findBySlug(trimmedSlug);
  if (campaignRow === null) {
    return { ok: false, code: "CAMPAIGN_NOT_FOUND" };
  }

  const submissionId = submissionRepository.create({
    campaignId: campaignRow.id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    company: payload.company,
  });

  return { ok: true, submissionId };
}

export function getAllSubmissions(): SubmissionListItem[] {
  return submissionRepository.findAllWithCampaignName();
}
