/**
 * Read access for events. Returns DB row shapes; use mapper for domain models.
 */

import { getDb } from "../db/connection.js";
import type { EventRow } from "../types/event.js";

const selectColumns = `id, campaign_id, name, event_date, location, capacity, description`;

export function findByCampaignId(campaignId: number): EventRow[] {
  return getDb()
    .prepare(
      `SELECT ${selectColumns}
       FROM events
       WHERE campaign_id = ?
       ORDER BY event_date ASC, id ASC`,
    )
    .all(campaignId) as EventRow[];
}
