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

    const response = await fetch('http://localhost:8000/generate_cover_letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(result)
    });

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
      <EvaluationResult
        score={result.score}
        alignments={result.alignments || []}
        gaps={result.gaps || []}
        summary={result.summary || ''}
      />
      <div className="text-center">
        <button className="btn btn-success mb-3" onClick={handleDownload}>
          Generate Tailored Cover Letter
        </button>
        <img src="/logo-placeholder.png" alt="Placeholder" className="centered-logo" />
      </div>
    </div>
  );
}