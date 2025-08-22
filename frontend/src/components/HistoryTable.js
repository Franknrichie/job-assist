import React from "react";
import { Trash2 } from "lucide-react";
import { deleteResult, downloadCoverLetterUrl, updateApplied } from "../api";
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
      <table className="history-table responsive-stack table table-bordered table-hover table-sm align-middle text-center">
        <thead className="table-light">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Applied</th>
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
                <td data-label="Date">{formatDate(record.created_at)}</td>
                <td data-label="Applied">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    title="check this box if you have applied to this job"
                    checked={!!record.applied}
                    onChange={async (e) => {
                      try {
                        await updateApplied(userId, record.job_id, e.target.checked);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        // Reuse existing reload prop for simplicity
                        onRecordDeleted && onRecordDeleted();
                      }
                    }}
                  />
                </td>
                <td data-label="Score">
                  <div className="score-badge score-badge--xs mx-auto" role="img" aria-label={`Score ${score}`}>
                    <div className="score-badge__number">{score}</div>
                  </div>
                </td>
                <td data-label="Company">{record.company_name}</td>
                <td data-label="Job Title">{record.job_title}</td>
                <td data-label="Cover Letter">
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
                <td data-label="Delete" className="actions">
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
              <td colSpan={7} className="text-muted">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
