import React from 'react';
import { downloadCoverLetterUrl } from '../api';

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
            {/* <td>{record.score}</td> */}
            <td>N/A</td>
            <td>{record.company_name}</td>
            <td>{record.job_title}</td>
            <td>
              {record.cover_letter_text ? (
                <a
                  href={downloadCoverLetterUrl(record.user_id || '', record.job_id)}
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