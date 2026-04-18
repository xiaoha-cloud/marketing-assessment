import { useCampaigns } from "../hooks/useCampaigns.js";
import { CampaignCard } from "../components/CampaignCard.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import { PageHero } from "../components/PageHero.js";

export function CampaignListPage() {
  const { campaigns, isLoading, error, reload } = useCampaigns();

  return (
    <main className="mx-auto w-full max-w-[52rem] flex-1 px-5 pb-16 pt-8">
      <PageHero
        eyebrow="Marketing programs"
        title="Campaigns"
        subtitle="Browse live programs, open their landing experiences, and send campaign email to a recipient."
        variant="gradient"
      />
      {isLoading ? <LoadingState message="Loading campaigns…" /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} onRetry={() => void reload()} /> : null}
      {!isLoading && error === null && campaigns !== null ? (
        <div className="flex flex-col gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : null}
    </main>
  );
}
