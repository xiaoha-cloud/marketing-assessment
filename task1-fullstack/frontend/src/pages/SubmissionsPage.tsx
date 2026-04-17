import { useCallback, useEffect, useState } from "react";
import { fetchSubmissions } from "../api/submissionApi.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import { SubmissionTable } from "../components/SubmissionTable.js";
import type { SubmissionListItem } from "../types/submission.js";

export function SubmissionsPage() {
  const [rows, setRows] = useState<SubmissionListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubmissions();
      setRows(data);
    } catch (err) {
      setRows(null);
      setError(err instanceof Error ? err.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="page submissions-page">
      <h1>Submissions</h1>
      {loading ? <LoadingState message="Loading submissions…" /> : null}
      {error !== null && !loading ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}
      {!loading && error === null && rows !== null ? (
        <SubmissionTable rows={rows} />
      ) : null}
    </main>
  );
}
