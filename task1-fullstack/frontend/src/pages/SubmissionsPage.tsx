import { useCallback, useState } from "react";
import { fetchSubmissionsExportCsv } from "../api/submissionApi.js";
import { useSubmissions } from "../hooks/useSubmissions.js";
import { downloadBlob } from "../utils/downloadFile.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import { PageHeader } from "../components/PageHeader.js";
import { SubmissionTable } from "../components/SubmissionTable.js";

export function SubmissionsPage() {
  const { submissions, isLoading, error, reload } = useSubmissions();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleDownloadCsv = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await fetchSubmissionsExportCsv();
      downloadBlob(blob, "submissions.csv");
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <main className="page page--submissions">
      <PageHeader
        title="Submissions"
        description="Leads captured from landing pages. Export matches this view."
        actions={
          <button
            type="button"
            className="button button--secondary"
            onClick={() => void handleDownloadCsv()}
            disabled={isExporting}
          >
            {isExporting ? "Preparing…" : "Download CSV"}
          </button>
        }
      />
      {exportError !== null ? (
        <p className="inline-alert inline-alert--error" role="status">
          {exportError}
        </p>
      ) : null}
      {isLoading ? <LoadingState message="Loading submissions…" /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} onRetry={() => void reload()} /> : null}
      {!isLoading && error === null && submissions !== null ? (
        <SubmissionTable rows={submissions} />
      ) : null}
    </main>
  );
}
