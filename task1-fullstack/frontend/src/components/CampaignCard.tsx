import { Link } from "react-router-dom";
import type { CampaignWithEvents } from "../types/campaign.js";
import { EventList } from "./EventList.js";

type CampaignCardProps = {
  campaign: CampaignWithEvents;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <article className="campaign-card">
      <header className="campaign-card__header">
        <h2 className="campaign-card__title">{campaign.name}</h2>
        <p className="campaign-card__meta">
          <span>{campaign.status}</span>
          <span aria-hidden="true" className="campaign-card__meta-sep">
            ·
          </span>
          <span>{campaign.platform}</span>
        </p>
        <p className="campaign-card__link-row">
          <Link className="text-link" to={`/landing/${campaign.slug}`}>
            Open landing page
          </Link>
        </p>
      </header>
      <EventList events={campaign.events} />
    </article>
  );
}
