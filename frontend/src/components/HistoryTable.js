import React from "react";
import { Trash2 } from "lucide-react";
import { deleteResult, downloadCoverLetterUrl } from "../api";
import { useAuth } from "../context/AuthContext";

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

export default function HistoryTable({ records, userId, onRecordDeleted }) {
  const { user } = useAuth();

  async function handleDelete(jobId) {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await deleteResult(userId, jobId, user.token);
      // Call the callback to refresh the data
      if (onRecordDeleted) {
        onRecordDeleted();
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
      alert(`Failed to delete record: ${error.message}`);
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle text-center">
        <thead className="table-light">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Score</th>
            <th scope="col">Company</th>
            <th scope="col">Job Title</th>
            <th scope="col">Cover Letter</th>
            <th scope="col">Delete</th>
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
                  {record.has_cover_letter ? (
                    <div>
                      <a
                        href={downloadCoverLetterUrl(userId, record.job_id)}
                        className="btn btn-sm btn-secondary btn-3d"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(record.job_id)}
                    className="bg-transparent border-0 p-0 text-danger"
                    style={{ cursor: "pointer" }}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            );
          })}
          {records.length === 0 && (
            <tr>
              <td colSpan={6} className="text-muted">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
