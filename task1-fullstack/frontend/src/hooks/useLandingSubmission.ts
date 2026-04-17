import { useCallback, useState } from "react";
import { LandingSubmitError, submitLandingLead } from "../api/landingApi.js";
import type { LandingSubmissionRequest } from "../types/submission.js";

export type UseLandingSubmissionResult = {
  isSubmitting: boolean;
  submitError: string | null;
  /** Resolves to `true` when the lead was created successfully. */
  submit: (body: LandingSubmissionRequest) => Promise<boolean>;
  reset: () => void;
};

/**
 * Submits the landing lead form for a fixed campaign slug.
 */
export function useLandingSubmission(slug: string): UseLandingSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    async (body: LandingSubmissionRequest): Promise<boolean> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await submitLandingLead(slug, body);
        return true;
      } catch (err) {
        const message =
          err instanceof LandingSubmitError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Submission failed";
        setSubmitError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [slug],
  );

  const reset = useCallback(() => {
    setSubmitError(null);
  }, []);

  return { isSubmitting, submitError, submit, reset };
}
