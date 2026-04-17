import { Link } from "react-router-dom";
import type { CampaignWithEvents } from "../types/campaign.js";
import { EventList } from "./EventList.js";
import { SendEmailForm } from "./SendEmailForm.js";

type CampaignCardProps = {
  campaign: CampaignWithEvents;
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <article className="flex flex-col border-2 border-ink bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-3 gap-x-5 border-b border-ink px-[1.35rem] pb-4 pt-[1.15rem]">
        <div className="min-w-0 flex-[1_1_14rem]">
          <h2 className="mb-1.5 text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {campaign.name}
          </h2>
          <p className="m-0 text-[0.82rem] leading-snug text-muted">
            <span>{campaign.status}</span>
            <span aria-hidden="true" className="mx-1">
              ·
            </span>
            <span>{campaign.platform}</span>
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          <Link
            className="inline-flex items-center gap-0.5 border-b-2 border-ink pb-0.5 text-[0.72rem] font-bold uppercase tracking-[0.07em] text-ink no-underline hover:border-muted hover:text-muted"
            to={`/landing/${campaign.slug}`}
          >
            Open landing page <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
      <div className="flex flex-[1_1_auto] flex-col px-[1.35rem] pb-[1.1rem] pt-4">
        <EventList events={campaign.events} />
      </div>
      <footer className="border-t border-ink bg-page px-[1.35rem] pb-3 pt-[0.65rem]">
        <SendEmailForm campaignId={campaign.id} />
      </footer>
    </article>
  );
}
