import { useCallback, useEffect, useState } from "react";
import { fetchCampaigns } from "../api/campaignApi.js";
import type { CampaignWithEvents } from "../types/campaign.js";
import type { RemoteDataStatus } from "../types/remoteData.js";

export type UseCampaignsResult = {
  data: CampaignWithEvents[] | null;
  status: RemoteDataStatus;
  error: string | null;
  reload: () => Promise<void>;
};

export function useCampaigns(): UseCampaignsResult {
  const [data, setData] = useState<CampaignWithEvents[] | null>(null);
  const [status, setStatus] = useState<RemoteDataStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const list = await fetchCampaigns();
      setData(list);
      setStatus("success");
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, status, error, reload };
}
