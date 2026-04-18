/**
 * CSV serialization helpers for submission export.
 */

import type { SubmissionExportRow } from "../types/submission.js";

const SUBMISSION_EXPORT_COLUMNS: (keyof SubmissionExportRow)[] = [
  "id",
  "campaignId",
  "campaignName",
  "firstName",
  "lastName",
  "email",
  "company",
  "submittedAt",
];

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Stable header row (camelCase, aligned with `SubmissionExportRow`). */
export function getSubmissionCsvHeaderLine(): string {
  return SUBMISSION_EXPORT_COLUMNS.join(",");
}

export function serializeSubmissionExportRows(rows: SubmissionExportRow[]): string {
  const lines = [getSubmissionCsvHeaderLine()];
  for (const row of rows) {
    lines.push(SUBMISSION_EXPORT_COLUMNS.map((key) => escapeCsvCell(row[key])).join(","));
  }
  return `${lines.join("\r\n")}\r\n`;
}
