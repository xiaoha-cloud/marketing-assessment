import { useCallback, useEffect, useState } from "react";
import { fetchCampaigns } from "../api/campaignApi.js";
import type { CampaignWithEvents } from "../types/campaign.js";

export type UseCampaignsResult = {
  campaigns: CampaignWithEvents[] | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/**
 * Loads the campaign list for the internal campaigns page.
 */
export function useCampaigns(): UseCampaignsResult {
  const [campaigns, setCampaigns] = useState<CampaignWithEvents[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await fetchCampaigns();
      setCampaigns(list);
    } catch (err) {
      setCampaigns(null);
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { campaigns, isLoading, error, reload };
}
