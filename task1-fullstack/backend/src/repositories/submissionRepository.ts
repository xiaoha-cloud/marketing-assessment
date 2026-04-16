/**
 * Read access for submissions (append-only table).
 * Inserts are implemented in the submission service phase.
 */

import { getDb } from "../db/connection.js";
import type { SubmissionRow } from "../types/submission.js";

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
