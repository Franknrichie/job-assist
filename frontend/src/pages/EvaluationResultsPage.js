// src/pages/EvaluationResultsPage.js
import React, { useEffect, useState } from 'react';
import EvaluationResult from '../components/EvaluationResult';

export default function EvaluationResultsPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('evaluation');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  const handleDownload = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // NOTE:
    // Your backend /generate_cover_letter expects:
    // { resume_text, job_description, company_name }
    // This call still posts `result` as-is (as in your original code).
    // Once you store resume_text / job_description / company_name, update the body accordingly.

    const response = await fetch('http://localhost:8000/generate_cover_letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(result)
    });

    if (!response.ok) {
      const msg = await response.text().catch(() => '');
      alert(`Cover letter generation failed: HTTP ${response.status}\n${msg}`);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.docx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!result) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container-xl mt-4">
      {/* Fallback: if backend returned a single 'evaluation' string,
          render it nicely; otherwise use the structured component */}
      {result.evaluation ? (
        <div className="card-like p-3">
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {result.evaluation}
          </pre>
        </div>
      ) : (
        <EvaluationResult
          score={result.score}
          alignments={result.alignments || []}
          gaps={result.gaps || []}
          summary={result.summary || ''}
        />
      )}

      <div className="text-center">
        <button className="btn btn-success mb-3" onClick={handleDownload}>
          Generate Tailored Cover Letter
        </button>
        <img src="/logo-placeholder.png" alt="Placeholder" className="centered-logo" />
      </div>
    </div>
  );
}
