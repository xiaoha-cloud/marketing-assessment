/**
 * Campaign domain models and persistence row shape.
 */

import type { Event } from "./event.js";

export type Campaign = {
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
};

export type CampaignRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  email_subject: string;
  cta_text: string;
  status: string;
  platform: string;
  budget_usd: number;
  created_at: string;
};

/** Public landing page payload: campaign details plus events for the page. */
export type CampaignLandingView = {
  id: number;
  name: string;
  slug: string;
  description: string;
  ctaText: string;
  events: Event[];
};

export type CampaignWithEvents = Campaign & {
  events: Event[];
};
