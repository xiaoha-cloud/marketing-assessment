import { Link } from "react-router-dom";
import type { CampaignWithEvents } from "../types/campaign.js";
import { EventList } from "./EventList.js";
import { SendEmailForm } from "./SendEmailForm.js";

type CampaignCardProps = {
  campaign: CampaignWithEvents;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <article className="campaign-card">
      <header className="campaign-card__header">
        <div className="campaign-card__header-main">
          <h2 className="campaign-card__title">{campaign.name}</h2>
          <p className="campaign-card__meta">
            <span>{campaign.status}</span>
            <span aria-hidden="true" className="campaign-card__meta-sep">
              ·
            </span>
            <span>{campaign.platform}</span>
          </p>
        </div>
        <div className="campaign-card__header-action">
          <Link className="campaign-card__landing-link" to={`/landing/${campaign.slug}`}>
            Open landing page <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
      <div className="campaign-card__body">
        <EventList events={campaign.events} />
      </div>
      <footer className="campaign-card__footer">
        <SendEmailForm campaignId={campaign.id} />
      </footer>
    </article>
  );
}
