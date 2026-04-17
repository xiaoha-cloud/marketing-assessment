import { useCallback, useState } from "react";
import { LandingSubmitError, submitLandingLead } from "../api/landingApi.js";
import type { LandingSubmissionRequest } from "../types/submission.js";

export type LandingSubmitStatus = "idle" | "submitting" | "success" | "error";

export type UseLandingSubmissionResult = {
  status: LandingSubmitStatus;
  error: string | null;
  /** Resolves to `true` when the lead was created successfully. */
  submit: (body: LandingSubmissionRequest) => Promise<boolean>;
  reset: () => void;
};

export function useLandingSubmission(slug: string): UseLandingSubmissionResult {
  const [status, setStatus] = useState<LandingSubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (body: LandingSubmissionRequest): Promise<boolean> => {
      setStatus("submitting");
      setError(null);
      try {
        await submitLandingLead(slug, body);
        setStatus("success");
        return true;
      } catch (err) {
        setStatus("error");
        const message =
          err instanceof LandingSubmitError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Submission failed";
        setError(message);
        return false;
      }
    },
    [slug],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, submit, reset };
}
