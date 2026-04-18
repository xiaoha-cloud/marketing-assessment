/**
 * Seed campaigns and events from seed_campaigns.json when the database is empty.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "./connection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

type SeedEvent = {
  id: number;
  campaignId: number;
  name: string;
  eventDate: string;
  location: string;
  capacity: number;
  description: string;
};

type SeedCampaign = {
  id: number;
  name: string;
  slug: string;
  description: string;
  emailSubject: string;
  ctaText: string;
  status: string;
  platform: string;
  budgetUsd: number;
  createdAt: string;
  events: SeedEvent[];
};

export async function seedDb(): Promise<void> {
  const seedPath = join(__dirname, "seed_campaigns.json");
  const raw = readFileSync(seedPath, "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) AS c FROM campaigns").get() as { c: number };
  if (row.c > 0) {
    return;
  }

  const insertCampaign = db.prepare(
    `INSERT INTO campaigns (
      id, name, slug, description, email_subject, cta_text, status, platform, budget_usd, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const insertEvent = db.prepare(
    `INSERT INTO events (
      id, campaign_id, name, event_date, location, capacity, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  const insertAll = db.transaction((campaigns: SeedCampaign[]) => {
    for (const c of campaigns) {
      insertCampaign.run(
        c.id,
        c.name,
        c.slug,
        c.description,
        c.emailSubject,
        c.ctaText,
        c.status,
        c.platform,
        c.budgetUsd,
        c.createdAt,
      );
      for (const e of c.events) {
        insertEvent.run(
          e.id,
          e.campaignId,
          e.name,
          e.eventDate,
          e.location,
          e.capacity,
          e.description,
        );
      }
    }
  });

  insertAll(data as SeedCampaign[]);
}
