import { useCallback, useEffect, useState } from "react";
import { fetchLandingCampaign } from "../api/landingApi.js";
import type { CampaignLandingView } from "../types/campaign.js";

export type UseLandingCampaignResult = {
  campaign: CampaignLandingView | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/**
 * Loads a single campaign for the public landing experience.
 */
export function useLandingCampaign(slug: string | undefined): UseLandingCampaignResult {
  const [campaign, setCampaign] = useState<CampaignLandingView | null>(null);
  const [isLoading, setIsLoading] = useState(
    () => slug !== undefined && slug.trim() !== "",
  );
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (slug === undefined || slug.trim() === "") {
      setCampaign(null);
      setError("Campaign not found");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLandingCampaign(slug);
      setCampaign(data);
    } catch (err) {
      setCampaign(null);
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { campaign, isLoading, error, reload };
}
