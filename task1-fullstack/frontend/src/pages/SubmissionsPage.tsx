import { useCallback, useEffect, useState } from "react";
import { fetchSubmissions, fetchSubmissionsExportCsv } from "../api/submissionApi.js";
import { downloadBlob } from "../utils/downloadFile.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import { SubmissionTable } from "../components/SubmissionTable.js";
import type { SubmissionListItem } from "../types/submission.js";

export function SubmissionsPage() {
  const [rows, setRows] = useState<SubmissionListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

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

  const handleDownloadCsv = useCallback(async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await fetchSubmissionsExportCsv();
      downloadBlob(blob, "submissions.csv");
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <main className="page submissions-page">
      <header className="submissions-page-header">
        <h1>Submissions</h1>
        <button
          type="button"
          className="submissions-csv-button"
          onClick={() => void handleDownloadCsv()}
          disabled={exporting}
        >
          {exporting ? "Preparing download…" : "Download CSV"}
        </button>
      </header>
      {exportError !== null ? (
        <p className="form-feedback form-feedback--error" role="status">
          {exportError}
        </p>
      ) : null}
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
