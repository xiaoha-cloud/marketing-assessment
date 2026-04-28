/**
 * Read access for events. Returns DB row shapes; use mapper for domain models.
 */

import { prisma } from "../db/prisma.js";
import type { EventRow } from "../types/event.js";
import type { EventModel } from "../generated/prisma/models/Event.js";

function toEventRow(event: EventModel): EventRow {
  return {
    id: event.id,
    campaign_id: event.campaignId,
    name: event.name,
    event_date: event.eventDate,
    location: event.location,
    capacity: event.capacity,
    description: event.description,
  };
}

export async function findByCampaignId(campaignId: number): Promise<EventRow[]> {
  const events = await prisma.event.findMany({
    where: { campaignId },
    orderBy: [{ eventDate: "asc" }, { id: "asc" }],
  });
  return events.map(toEventRow);
}
