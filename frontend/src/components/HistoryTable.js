import React from "react";

function getScoreFromEvaluation(text) {
  const m = (text || "").match(/Score:\s*([0-9]+)/i);
  return m ? m[1] : "N/A";
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function HistoryTable({ records, userId }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle text-center">
        <thead className="table-light">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Score</th>            
            <th scope="col">Company</th>
            <th scope="col">Job Title</th>
            <th scope="col">Download</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => {
            const score = getScoreFromEvaluation(record.evaluation_result);
            return (
              <tr key={idx}>
                <td>{formatDate(record.created_at)}</td>
                <td>
                  <span className="badge rounded-pill bg-info px-3 py-2 fs-5">
                    {score}
                  </span>
                </td>                
                <td>{record.company_name}</td>
                <td>{record.job_title}</td>
                <td>
                  {record.cover_letter ? (
                    <a
                      href={`http://localhost:8000/results/${userId}/${record.job_id}/cover_letter.docx`}
                      className="btn btn-sm btn-secondary btn-3d"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
          {records.length === 0 && (
            <tr>
              <td colSpan={5} className="text-muted">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
