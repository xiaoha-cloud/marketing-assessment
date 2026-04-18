import { formatDateTime } from "../utils/formatDate.js";
import type { SubmissionListItem } from "../types/submission.js";

type SubmissionTableProps = {
  rows: SubmissionListItem[];
};

export function SubmissionTable({ rows }: SubmissionTableProps) {
  if (rows.length === 0) {
    return <p className="m-0 text-muted">No submissions yet.</p>;
  }

  return (
    <div className="overflow-x-auto border-2 border-ink bg-surface">
      <table className="w-full border-collapse text-[0.88rem] [&_tbody_tr:last-child_td]:border-b-0">
        <thead>
          <tr>
            <th
              className="border-b border-ink bg-page px-3 py-2 text-left text-[0.72rem] font-normal uppercase tracking-[0.06em] text-ink"
              scope="col"
            >
              Name
            </th>
            <th
              className="border-b border-ink bg-page px-3 py-2 text-left text-[0.72rem] font-normal uppercase tracking-[0.06em] text-ink"
              scope="col"
            >
              Email
            </th>
            <th
              className="border-b border-ink bg-page px-3 py-2 text-left text-[0.72rem] font-normal uppercase tracking-[0.06em] text-ink"
              scope="col"
            >
              Company
            </th>
            <th
              className="border-b border-ink bg-page px-3 py-2 text-left text-[0.72rem] font-normal uppercase tracking-[0.06em] text-ink"
              scope="col"
            >
              Campaign
            </th>
            <th
              className="border-b border-ink bg-page px-3 py-2 text-left text-[0.72rem] font-normal uppercase tracking-[0.06em] text-ink"
              scope="col"
            >
              Submitted
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border-b border-ink px-3 py-2 text-ink">
                {row.firstName} {row.lastName}
              </td>
              <td className="border-b border-ink px-3 py-2 text-ink">{row.email}</td>
              <td className="border-b border-ink px-3 py-2 text-ink">{row.company}</td>
              <td className="border-b border-ink px-3 py-2 text-ink">{row.campaignName ?? "—"}</td>
              <td className="border-b border-ink px-3 py-2 text-ink">{formatDateTime(row.submittedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
