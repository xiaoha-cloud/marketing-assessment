import { useCallback, useEffect, useState } from "react";
import { fetchLandingCampaign } from "../api/landingApi.js";
import type { CampaignLandingView } from "../types/campaign.js";
import type { RemoteDataStatus } from "../types/remoteData.js";

export type UseLandingCampaignResult = {
  data: CampaignLandingView | null;
  status: RemoteDataStatus;
  error: string | null;
  reload: () => Promise<void>;
};

export function useLandingCampaign(slug: string | undefined): UseLandingCampaignResult {
  const [data, setData] = useState<CampaignLandingView | null>(null);
  const [status, setStatus] = useState<RemoteDataStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (slug === undefined || slug.trim() === "") {
      setData(null);
      setError("Campaign not found");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const campaign = await fetchLandingCampaign(slug);
      setData(campaign);
      setStatus("success");
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load campaign");
      setStatus("error");
    }
  }, [slug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, status, error, reload };
}
