/**
 * Read and append-only create access for submissions.
 */

import { prisma } from "../db/prisma.js";
import type {
  CreateSubmissionInput,
  SubmissionListItem,
  SubmissionRow,
} from "../types/submission.js";
import type { SubmissionModel } from "../generated/prisma/models/Submission.js";

function toSubmissionRow(submission: SubmissionModel): SubmissionRow {
  return {
    id: submission.id,
    campaign_id: submission.campaignId,
    first_name: submission.firstName,
    last_name: submission.lastName,
    email: submission.email,
    company: submission.company,
    submitted_at: submission.submittedAt,
  };
}

export async function findByCampaignId(campaignId: number): Promise<SubmissionRow[]> {
  const submissions = await prisma.submission.findMany({
    where: { campaignId },
    orderBy: [{ submittedAt: "desc" }, { id: "desc" }],
  });
  return submissions.map(toSubmissionRow);
}

export async function findById(id: number): Promise<SubmissionRow | null> {
  const submission = await prisma.submission.findUnique({
    where: { id },
  });
  return submission === null ? null : toSubmissionRow(submission);
}

export async function create(input: CreateSubmissionInput): Promise<number> {
  const submittedAt = new Date().toISOString();
  const submission = await prisma.submission.create({
    data: {
      campaignId: input.campaignId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      company: input.company,
      submittedAt,
    },
    select: { id: true },
  });
  return submission.id;
}

export async function findAllWithCampaignName(): Promise<SubmissionListItem[]> {
  const submissions = await prisma.submission.findMany({
    include: {
      campaign: {
        select: { name: true },
      },
    },
    orderBy: [{ submittedAt: "desc" }, { id: "desc" }],
  });
  return submissions.map((submission) => ({
    id: submission.id,
    campaignId: submission.campaignId,
    campaignName: submission.campaign.name,
    firstName: submission.firstName,
    lastName: submission.lastName,
    email: submission.email,
    company: submission.company,
    submittedAt: submission.submittedAt,
  }));
}
