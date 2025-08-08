import React from 'react';

export default function HistoryTable({ records }) {
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
            <td>{record.score}</td>
            <td>{record.company}</td>
            <td>{record.title}</td>
            <td>
              {record.cover_letter_url ? (
                <a
                  href={record.cover_letter_url}
                  className="btn btn-sm btn-outline-primary"
                  download
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