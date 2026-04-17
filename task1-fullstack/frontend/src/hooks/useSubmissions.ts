import { useCallback, useEffect, useState } from "react";
import { fetchSubmissions, fetchSubmissionsExportCsv } from "../api/submissionApi.js";
import { downloadBlob } from "../utils/downloadFile.js";
import type { RemoteDataStatus } from "../types/remoteData.js";
import type { SubmissionListItem } from "../types/submission.js";

export type CsvExportStatus = "idle" | "pending" | "error";

export type UseSubmissionsResult = {
  data: SubmissionListItem[] | null;
  status: RemoteDataStatus;
  error: string | null;
  reload: () => Promise<void>;
  csvExport: {
    status: CsvExportStatus;
    error: string | null;
    download: () => Promise<void>;
    clearError: () => void;
  };
};

export function useSubmissions(): UseSubmissionsResult {
  const [data, setData] = useState<SubmissionListItem[] | null>(null);
  const [status, setStatus] = useState<RemoteDataStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const [csvStatus, setCsvStatus] = useState<CsvExportStatus>("idle");
  const [csvError, setCsvError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const rows = await fetchSubmissions();
      setData(rows);
      setStatus("success");
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load submissions");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const download = useCallback(async () => {
    setCsvStatus("pending");
    setCsvError(null);
    try {
      const blob = await fetchSubmissionsExportCsv();
      downloadBlob(blob, "submissions.csv");
      setCsvStatus("idle");
    } catch (err) {
      setCsvStatus("error");
      setCsvError(err instanceof Error ? err.message : "Download failed");
    }
  }, []);

  const clearCsvError = useCallback(() => {
    setCsvError(null);
    setCsvStatus("idle");
  }, []);

  return {
    data,
    status,
    error,
    reload,
    csvExport: {
      status: csvStatus,
      error: csvError,
      download,
      clearError: clearCsvError,
    },
  };
}
