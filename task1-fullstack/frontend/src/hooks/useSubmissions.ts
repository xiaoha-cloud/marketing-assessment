import { useCallback, useEffect, useState } from "react";
import { fetchSubmissions } from "../api/submissionApi.js";
import type { SubmissionListItem } from "../types/submission.js";

export type UseSubmissionsResult = {
  submissions: SubmissionListItem[] | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/**
 * Loads submissions for the internal dashboard (same data shape as CSV export).
 */
export function useSubmissions(): UseSubmissionsResult {
  const [submissions, setSubmissions] = useState<SubmissionListItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await fetchSubmissions();
      setSubmissions(rows);
    } catch (err) {
      setSubmissions(null);
      setError(err instanceof Error ? err.message : "Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { submissions, isLoading, error, reload };
}
