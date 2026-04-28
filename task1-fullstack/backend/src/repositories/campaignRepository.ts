/**
 * Read access for campaigns. Returns DB row shapes; use mapper for domain models.
 */

import { prisma } from "../db/prisma.js";
import type { CampaignRow } from "../types/campaign.js";
import type { CampaignModel } from "../generated/prisma/models/Campaign.js";

function toCampaignRow(campaign: CampaignModel): CampaignRow {
  return {
    id: campaign.id,
    name: campaign.name,
    slug: campaign.slug,
    description: campaign.description,
    email_subject: campaign.emailSubject,
    cta_text: campaign.ctaText,
    status: campaign.status,
    platform: campaign.platform,
    budget_usd: campaign.budgetUsd,
    created_at: campaign.createdAt,
  };
}

export async function findAll(): Promise<CampaignRow[]> {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { id: "asc" },
  });
  return campaigns.map(toCampaignRow);
}

export async function findById(id: number): Promise<CampaignRow | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
  });
  return campaign === null ? null : toCampaignRow(campaign);
}

export async function findBySlug(slug: string): Promise<CampaignRow | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  });
  return campaign === null ? null : toCampaignRow(campaign);
}
