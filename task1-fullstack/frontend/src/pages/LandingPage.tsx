import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLandingCampaign } from "../api/landingApi.js";
import { ErrorState } from "../components/ErrorState.js";
import { EventList } from "../components/EventList.js";
import { LandingForm } from "../components/LandingForm.js";
import { LoadingState } from "../components/LoadingState.js";
import type { CampaignLandingView } from "../types/campaign.js";

export function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [campaign, setCampaign] = useState<CampaignLandingView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (slug === undefined || slug.trim() === "") {
      setCampaign(null);
      setError("Campaign not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setLeadSaved(false);
    try {
      const data = await fetchLandingCampaign(slug);
      setCampaign(data);
    } catch (err) {
      setCampaign(null);
      setError(err instanceof Error ? err.message : "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="page landing-page">
      {loading ? <LoadingState message="Loading campaign…" /> : null}
      {error !== null && !loading ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && error === null && campaign !== null ? (
        <>
          <h1>{campaign.name}</h1>
          <p className="landing-description">{campaign.description}</p>
          <p className="landing-cta-label">
            <strong>Call to action:</strong> {campaign.ctaText}
          </p>
          <section className="landing-events" aria-labelledby="events-heading">
            <h2 id="events-heading">Events</h2>
            <EventList events={campaign.events} />
          </section>
          {leadSaved ? (
            <p className="landing-thankyou" role="status">
              Thank you — your information has been received.
            </p>
          ) : (
            <LandingForm
              slug={campaign.slug}
              disabled={leadSubmitting}
              onSubmittingChange={setLeadSubmitting}
              onSuccess={() => setLeadSaved(true)}
            />
          )}
        </>
      ) : null}
    </main>
  );
}
