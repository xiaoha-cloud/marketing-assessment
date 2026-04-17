/**
 * Campaign and event models (camelCase) as returned by GET /api/campaigns.
 */

export type Event = {
  id: number;
  campaignId: number;
  name: string;
  eventDate: string;
  location: string;
  capacity: number;
  description: string;
};

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

export type CampaignWithEvents = Campaign & {
  events: Event[];
};
