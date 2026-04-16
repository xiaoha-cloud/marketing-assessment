/**
 * Event domain model (camelCase) and SQLite row shape (snake_case).
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

export type EventRow = {
  id: number;
  campaign_id: number;
  name: string;
  event_date: string;
  location: string;
  capacity: number;
  description: string;
};
