import React from 'react';

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
            {/*parse score later from evaluation_result; N/A for now */}
            <td>N/A</td>
            <td>{record.company_name}</td>
            <td>{record.job_title}</td>
            <td>
              {record.cover_letter ? (
                <a
                  href={`http://localhost:8000/results/${userId}/${record.job_id}/cover_letter.docx`}
                  className="btn btn-sm btn-outline-primary"
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
