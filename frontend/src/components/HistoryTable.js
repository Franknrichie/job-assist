import React from 'react';

function getScore(text) {
  const m = (text || '').match(/Score:\s*([0-9]+)/i);
  return m ? m[1] : 'N/A';
}

export default function HistoryTable({ records, userId }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Alignment Score</th>
          <th>Company Name</th>
          <th>Job Title</th>
          <th>Cover Letter</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, idx) => (
          <tr key={idx}>
            <td>{getScore(record.evaluation_result)}</td>
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
                ''
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
