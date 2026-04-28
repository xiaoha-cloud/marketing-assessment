/**
 * Seed campaigns and events from seed_campaigns.json when the database is empty.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";
import { prisma } from "./prisma.js";

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

  const campaignCount = await prisma.campaign.count();
  if (campaignCount > 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const campaign of data as SeedCampaign[]) {
      await tx.campaign.create({
        data: {
          id: campaign.id,
          name: campaign.name,
          slug: campaign.slug,
          description: campaign.description,
          emailSubject: campaign.emailSubject,
          ctaText: campaign.ctaText,
          status: campaign.status,
          platform: campaign.platform,
          budgetUsd: campaign.budgetUsd,
          createdAt: campaign.createdAt,
          events: {
            create: campaign.events.map((event) => ({
              id: event.id,
              name: event.name,
              eventDate: event.eventDate,
              location: event.location,
              capacity: event.capacity,
              description: event.description,
            })),
          },
        },
      });
    }
  });
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDb()
    .catch((err: unknown) => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
