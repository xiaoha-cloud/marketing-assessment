import type { CampaignWithEvents } from "../types/campaign.js";
import { EventList } from "./EventList.js";

type CampaignCardProps = {
  campaign: CampaignWithEvents;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <article className="campaign-card">
      <header>
        <h2>{campaign.name}</h2>
        <p className="campaign-meta">
          <span>{campaign.status}</span>
          <span aria-hidden="true"> · </span>
          <span>{campaign.platform}</span>
        </p>
      </header>
      <EventList events={campaign.events} />
    </article>
  );
}
