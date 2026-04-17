import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSubmissionsExportCsv } from "../api/submissionApi.js";
import { useSubmissions } from "../hooks/useSubmissions.js";
import { downloadBlob } from "../utils/downloadFile.js";
import { buttonSecondary } from "../ui/buttonClasses.js";
import { ErrorState } from "../components/ErrorState.js";
import { LoadingState } from "../components/LoadingState.js";
import { PageHeader } from "../components/PageHeader.js";
import { SubmissionPagination } from "../components/SubmissionPagination.js";
import { SubmissionTable } from "../components/SubmissionTable.js";
import { SUBMISSIONS_PAGE_SIZE } from "../types/submission.js";

export function SubmissionsPage() {
  const { submissions, isLoading, error, reload } = useSubmissions();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = submissions?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / SUBMISSIONS_PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(Math.max(1, prev), totalPages));
  }, [submissions, totalPages]);

  const paginatedRows = useMemo(() => {
    if (submissions === null) {
      return null;
    }
    const start = (currentPage - 1) * SUBMISSIONS_PAGE_SIZE;
    return submissions.slice(start, start + SUBMISSIONS_PAGE_SIZE);
  }, [submissions, currentPage]);

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

  const goPrevious = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-8">
      <PageHeader
        variant="subdued"
        title="Submissions"
        description="Leads captured from landing pages. Export matches this view."
        actions={
          <button
            type="button"
            className={buttonSecondary}
            onClick={() => void handleDownloadCsv()}
            disabled={isExporting}
          >
            {isExporting ? "Preparing…" : "Download CSV"}
          </button>
        }
      />
      {exportError !== null ? (
        <p className="mb-4 text-[0.9rem] text-error" role="status">
          {exportError}
        </p>
      ) : null}
      {isLoading ? <LoadingState message="Loading submissions…" /> : null}
      {!isLoading && error !== null ? <ErrorState message={error} onRetry={() => void reload()} /> : null}
      {!isLoading && error === null && submissions !== null && paginatedRows !== null ? (
        <>
          <SubmissionTable rows={paginatedRows} />
          <SubmissionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={SUBMISSIONS_PAGE_SIZE}
            onPrevious={goPrevious}
            onNext={goNext}
          />
        </>
      ) : null}
    </main>
  );
}
