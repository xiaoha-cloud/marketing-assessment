import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLandingCampaign } from "../hooks/useLandingCampaign.js";
import { ErrorState } from "../components/ErrorState.js";
import { EventList } from "../components/EventList.js";
import { LandingForm } from "../components/LandingForm.js";
import { LoadingState } from "../components/LoadingState.js";
import { PageHero } from "../components/PageHero.js";
import { PageSection } from "../components/PageSection.js";

export function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: campaign, status, error, reload } = useLandingCampaign(slug);
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    setLeadSaved(false);
  }, [slug]);

  return (
    <main className="page page--landing">
      {status === "loading" ? <LoadingState message="Loading campaign…" /> : null}
      {status === "error" && error !== null ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : null}
      {status === "success" && campaign !== null ? (
        <>
          <PageHero
            eyebrow="Campaign"
            title={campaign.name}
            subtitle={campaign.description}
            variant="gradient"
          >
            <p className="page-hero__cta-line">
              <span className="page-hero__cta-label">Call to action</span>
              <span className="page-hero__cta-text">{campaign.ctaText}</span>
            </p>
          </PageHero>
          <PageSection title="Events" titleId="landing-events-title">
            <EventList events={campaign.events} />
          </PageSection>
          {leadSaved ? (
            <PageSection title="Thank you" titleId="landing-thanks-title" className="page-section--thankyou">
              <p className="thankyou-copy" role="status">
                Your information has been received. We will follow up shortly.
              </p>
            </PageSection>
          ) : (
            <LandingForm key={campaign.slug} slug={campaign.slug} onSuccess={() => setLeadSaved(true)} />
          )}
        </>
      ) : null}
    </main>
  );
}
