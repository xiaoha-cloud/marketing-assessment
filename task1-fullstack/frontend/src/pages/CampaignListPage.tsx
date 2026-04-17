import { useCallback, useEffect, useState } from "react";
import { fetchCampaigns } from "../api/campaignApi.js";
import { CampaignCard } from "../components/CampaignCard.js";
import { SendEmailForm } from "../components/SendEmailForm.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import type { CampaignWithEvents } from "../types/campaign.js";

export function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<CampaignWithEvents[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCampaigns();
      setCampaigns(data);
    } catch (err) {
      setCampaigns(null);
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="page campaign-list-page">
      <h1>Campaigns</h1>
      {loading ? <LoadingState /> : null}
      {error !== null && !loading ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && error === null && campaigns !== null ? (
        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-list-item">
              <CampaignCard campaign={campaign} />
              <SendEmailForm campaignId={campaign.id} />
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}
