import type { SubmissionListItem } from "../types/submission.js";

type SubmissionTableProps = {
  rows: SubmissionListItem[];
};

export function SubmissionTable({ rows }: SubmissionTableProps) {
  if (rows.length === 0) {
    return <p className="submission-table-empty">No submissions yet.</p>;
  }

  return (
    <div className="submission-table-wrap">
      <table className="submission-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Company</th>
            <th scope="col">Campaign</th>
            <th scope="col">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                {row.firstName} {row.lastName}
              </td>
              <td>{row.email}</td>
              <td>{row.company}</td>
              <td>{row.campaignName ?? "—"}</td>
              <td>{row.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
