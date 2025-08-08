import React from 'react';

export default function EvaluationResult({ score, alignments, gaps, summary }) {
  return (
    <div className="card-like mb-4">
      <h2 className="text-center">Alignment Score: {score}/10</h2>
      <h4 className="mt-4">Alignments</h4>
      <ul>
        {alignments.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <h4 className="mt-4">Gaps</h4>
      <ul>
        {gaps.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <h4 className="mt-4">Summary</h4>
      <p>{summary}</p>
    </div>
  );
}