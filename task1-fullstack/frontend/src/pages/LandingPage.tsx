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
  const { campaign, isLoading, error, reload } = useLandingCampaign(slug);
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    setLeadSaved(false);
  }, [slug]);

  return (
    <main className="mx-auto w-full max-w-[42rem] flex-1 px-5 pb-16 pt-8">
      {isLoading ? <LoadingState message="Loading campaign…" /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} onRetry={() => void reload()} /> : null}
      {!isLoading && error === null && campaign !== null ? (
        <>
          <PageHero eyebrow="Campaign" title={campaign.name} subtitle={campaign.description} variant="gradient">
            <p className="mt-6 flex flex-col gap-1.5 border-t border-white/35 pt-5 text-[0.95rem]">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] opacity-85">
                Call to action
              </span>
              <span className="font-semibold">{campaign.ctaText}</span>
            </p>
          </PageHero>
          <PageSection title="Events" titleId="landing-events-title">
            <EventList events={campaign.events} />
          </PageSection>
          {leadSaved ? (
            <PageSection
              title="Thank you"
              titleId="landing-thanks-title"
              className="border-2 border-ink bg-surface p-5 md:p-6"
            >
              <p className="m-0 text-base" role="status">
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
