/**
 * Read and append-only create access for submissions.
 */

import { getDb } from "../db/connection.js";
import type {
  CreateSubmissionInput,
  SubmissionListItem,
  SubmissionListJoinRow,
  SubmissionRow,
} from "../types/submission.js";
import { mapSubmissionListJoinRow } from "../utils/mapper.js";

const selectColumns = `id, campaign_id, first_name, last_name, email, company, submitted_at`;

export function findByCampaignId(campaignId: number): SubmissionRow[] {
  return getDb()
    .prepare(
      `SELECT ${selectColumns}
       FROM submissions
       WHERE campaign_id = ?
       ORDER BY submitted_at DESC, id DESC`,
    )
    .all(campaignId) as SubmissionRow[];
}

export function findById(id: number): SubmissionRow | null {
  const row = getDb()
    .prepare(
      `SELECT ${selectColumns}
       FROM submissions
       WHERE id = ?`,
    )
    .get(id) as SubmissionRow | undefined;
  return row ?? null;
}

export function create(input: CreateSubmissionInput): number {
  const submittedAt = new Date().toISOString();
  const result = getDb()
    .prepare(
      `INSERT INTO submissions (
        campaign_id, first_name, last_name, email, company, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.campaignId,
      input.firstName,
      input.lastName,
      input.email,
      input.company,
      submittedAt,
    );
  return Number(result.lastInsertRowid);
}

export function findAllWithCampaignName(): SubmissionListItem[] {
  const rows = getDb()
    .prepare(
      `SELECT
         s.id,
         s.campaign_id,
         c.name AS campaign_name,
         s.first_name,
         s.last_name,
         s.email,
         s.company,
         s.submitted_at
       FROM submissions s
       INNER JOIN campaigns c ON c.id = s.campaign_id
       ORDER BY s.submitted_at DESC, s.id DESC`,
    )
    .all() as SubmissionListJoinRow[];
  return rows.map(mapSubmissionListJoinRow);
}
