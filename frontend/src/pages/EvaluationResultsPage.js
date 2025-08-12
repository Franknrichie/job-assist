import React, { useEffect, useMemo, useState } from 'react';

// Render at least 5 li elements for Alignments and Gaps to reserve space, CSS hides the palceholder text
const padToFive = (arr = []) => {
  const a = Array.isArray(arr) ? arr : [];
  return [...a, ...Array(Math.max(0, 5 - a.length)).fill(null)];
};

// tiny parser that converts the evaluation string into structured pieces
function parseEvaluationText(text) {
  if (!text) return null;

  // Normalize newlines
  const t = String(text).replace(/\r\n/g, '\n');

  // Score: grab the first "Score: <num>"
  const scoreMatch = t.match(/Score:\s*([0-9]+)\b/i);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;

  // Slice out the "Alignments and Gaps" block
  const agStart = t.search(/Alignments\s+and\s+Gaps:/i);
  let alignments = [];
  let gaps = [];

  if (agStart !== -1) {
    const afterAG = t.slice(agStart);
    // Collect all bullet lines under that section
    const bullets = afterAG
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.startsWith('- '));

    alignments = bullets
      .filter(s => /^-+\s*Alignment:/i.test(s))
      .map(s => s.replace(/^-\s*Alignment:\s*/i, '').trim());

    gaps = bullets
      .filter(s => /^-+\s*Gap:/i.test(s))
      .map(s => s.replace(/^-\s*Gap:\s*/i, '').trim());
  }

  // Summary: grab everything after "Summary:" until the next --- or end
  let summary = '';
  const summaryIdx = t.search(/Summary:/i);
  if (summaryIdx !== -1) {
    const afterSummary = t.slice(summaryIdx + 'Summary:'.length);
    const stop = afterSummary.indexOf('---');
    summary = (stop !== -1 ? afterSummary.slice(0, stop) : afterSummary).trim();
  }

  // If we failed to find anything meaningful, return null
  const hasContent = score || alignments.length || gaps.length || summary;
  return hasContent ? { score, alignments, gaps, summary } : null;
}

export default function EvaluationResultsPage() {
  const [raw, setRaw] = useState(null);          // raw object from localStorage (may have .evaluation)
  const [inputs, setInputs] = useState(null);    // resume_text, job_description, company_name

  useEffect(() => {
    const stored = localStorage.getItem('evaluation');
    if (stored) setRaw(JSON.parse(stored));

    const storedInputs = localStorage.getItem('evaluationInputs');
    if (storedInputs) setInputs(JSON.parse(storedInputs));
  }, []);

  // Build payload and download .docx
  const handleDownload = async () => {
    const payload = {
      resume_text: inputs?.resume_text || '',
      job_description: inputs?.job_description || '',
      company_name: inputs?.company_name || 'Your Company',
    };

    try {
      const response = await fetch('http://localhost:8000/generate_cover_letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // after successful download:
      // If the user is logged in, mark this record as having a stored cover letter
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const jobId = localStorage.getItem('lastJobId');
      if (user && jobId) {
       const company = (inputs?.company_name || 'Your Company').trim();
       const simpleText = `Dear Hiring Team at ${company},\n\n(Generated in dummy mode)\n\nSincerely,\nYour Candidate`;
       try {
         // tell backend to attach cover_letter_text to this result
         await fetch('http://localhost:8000/save_cover_letter', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ user_id: user.id, job_id: jobId, cover_letter_text: simpleText })
         });
       } catch (e) {
         console.warn('Could not save cover letter to history:', e);
       }
      }

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
    } catch (e) {
      alert(`Download failed:\n${e.message}`);
    }
  };

  // Parse the evaluation string (if present)
  const parsed = useMemo(() => {
    const text = raw?.evaluation; // backend returns { evaluation: "..." }
    return parseEvaluationText(text);
  }, [raw]);

  if (!raw) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container-xl mt-4">
      <div className="d-flex justify-content-center mb-4">
        <div className="score-badge">
          <div className="score-badge__number">
            {parsed?.score ?? '—'}
          </div>
          <div className="score-badge__label">Alignment Score</div>
        </div>
      </div>

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-lg-6">
          <div className="section-card h-100 d-flex flex-column">
            <h5 className="section-card__title">Alignments</h5>
            <ul className="section-list mb-0 ps-4">
              {padToFive(parsed?.alignments).map((item, i) => (
                <li key={i} className={item ? '' : 'placeholder-bullet'}>
                  {item || '•'}
                </li>
              ))}
            </ul>
          </div>
        </div>
            
        <div className="col-12 col-lg-6">
          <div className="section-card h-100 d-flex flex-column">
            <h5 className="section-card__title">Gaps</h5>
            <ul className="section-list mb-0 ps-4">
              {padToFive(parsed?.gaps).map((item, i) => (
                <li key={i} className={item ? '' : 'placeholder-bullet'}>
                  {item || '•'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="section-card review-summary mt-4">
        <h5 className="section-card__title">Review Summary</h5>
        {parsed?.summary ? (
          <p className="mb-0">{parsed.summary}</p>
        ) : (
          // Fallback: render the whole evaluation text if parsing failed
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {raw.evaluation || 'No summary available.'}
          </pre>
        )}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary mb-0 btn-3d" onClick={handleDownload}>
          Generate Tailored Cover Letter
        </button>
        {/* <img src="/AlignAI-logo.png" alt="Placeholder" className="alignAI-logo mt-0" /> */}
      </div>
    </div>
  );
}
