import { useSubmissions } from "../hooks/useSubmissions.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import { PageHeader } from "../components/PageHeader.js";
import { SubmissionTable } from "../components/SubmissionTable.js";

export function SubmissionsPage() {
  const { data, status, error, reload, csvExport } = useSubmissions();

  return (
    <main className="page page--submissions">
      <PageHeader
        title="Submissions"
        description="Leads captured from landing pages. Export matches this view."
        actions={
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              csvExport.clearError();
              void csvExport.download();
            }}
            disabled={csvExport.status === "pending"}
          >
            {csvExport.status === "pending" ? "Preparing…" : "Download CSV"}
          </button>
        }
      />
      {csvExport.error !== null ? (
        <p className="inline-alert inline-alert--error" role="status">
          {csvExport.error}
        </p>
      ) : null}
      {status === "loading" ? <LoadingState message="Loading submissions…" /> : null}
      {status === "error" && error !== null ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : null}
      {status === "success" && data !== null ? <SubmissionTable rows={data} /> : null}
    </main>
  );
}
