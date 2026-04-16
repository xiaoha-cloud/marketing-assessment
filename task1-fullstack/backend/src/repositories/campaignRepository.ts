/**
 * Read access for campaigns. Returns DB row shapes; use mapper for domain models.
 */

import { getDb } from "../db/connection.js";
import type { CampaignRow } from "../types/campaign.js";

const selectColumns = `id, name, slug, description, email_subject, cta_text, status, platform, budget_usd, created_at`;

export function findAll(): CampaignRow[] {
  return getDb()
    .prepare(
      `SELECT ${selectColumns}
       FROM campaigns
       ORDER BY id ASC`,
    )
    .all() as CampaignRow[];
}

export function findById(id: number): CampaignRow | null {
  const row = getDb()
    .prepare(
      `SELECT ${selectColumns}
       FROM campaigns
       WHERE id = ?`,
    )
    .get(id) as CampaignRow | undefined;
  return row ?? null;
}

export function findBySlug(slug: string): CampaignRow | null {
  const row = getDb()
    .prepare(
      `SELECT ${selectColumns}
       FROM campaigns
       WHERE slug = ?`,
    )
    .get(slug) as CampaignRow | undefined;
  return row ?? null;
}
