import React, { useState, useEffect, useMemo } from "react";
import { generateCoverLetter, downloadCoverLetterDocx, saveCoverLetter } from "../api";
import { useAuth } from "../context/AuthContext";

// Render at least 5 li elements for Alignments and Gaps to reserve space, CSS hides the placeholder text
const padToFive = (arr = []) => {
  const a = Array.isArray(arr) ? arr : [];
  return [...a, ...Array(Math.max(0, 5 - a.length)).fill(null)];
};

// tiny parser that converts the evaluation string into structured pieces
function parseEvaluationText(text) {
  if (!text) return null;

  const t = String(text).replace(/\r\n/g, '\n');
  const scoreMatch = t.match(/Score:\s*([0-9]+)\b/i);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;

  const agStart = t.search(/Alignments\s+and\s+Gaps:/i);
  let alignments = [];
  let gaps = [];

  if (agStart !== -1) {
    const afterAG = t.slice(agStart);
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

  let summary = '';
  const summaryIdx = t.search(/Summary:/i);
  if (summaryIdx !== -1) {
    const afterSummary = t.slice(summaryIdx + 'Summary:'.length);
    const stop = afterSummary.indexOf('---');
    summary = (stop !== -1 ? afterSummary.slice(0, stop) : afterSummary).trim();
  }

  const hasContent = score || alignments.length || gaps.length || summary;
  return hasContent ? { score, alignments, gaps, summary } : null;
}

export default function EvaluationResultsPage() {
  const [raw, setRaw] = useState(null);
  const [inputs, setInputs] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('evaluation');
    if (stored) setRaw(JSON.parse(stored));

    const storedInputs = localStorage.getItem('evaluationInputs');
    if (storedInputs) setInputs(JSON.parse(storedInputs));
  }, []);

  const handleDownload = async () => {
    const payload = {
      resume_text: inputs?.resume_text || '',
      job_description: inputs?.job_description || '',
      company_name: inputs?.company_name || 'Your Company',
    };

    try {
      console.log('Starting cover letter generation...');
      
      // 1. Generate cover letter text for saving to database
      const textResponse = await generateCoverLetter(payload, user.token);
      const { cover_letter_text } = textResponse;
      console.log('Cover letter text generated:', cover_letter_text ? 'Yes' : 'No');

      // 2. Download the .docx file
      const docxBlob = await downloadCoverLetterDocx(payload, user.token);
      const url = window.URL.createObjectURL(docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cover_letter.docx';
      a.click();
      window.URL.revokeObjectURL(url);
      console.log('Cover letter downloaded');

      // 3. Save to history
      const jobId = localStorage.getItem('lastJobId');
      console.log('Job ID from localStorage:', jobId);
      console.log('User ID:', user.user_id);
      
      if (user && user.user_id && jobId && cover_letter_text) {
        try {
          const saveResult = await saveCoverLetter(user.user_id, jobId, cover_letter_text, user.token);
          console.log('Cover letter saved successfully:', saveResult);
        } catch (saveError) {
          console.error('Failed to save cover letter:', saveError);
        }
      } else {
        console.warn('Missing required data for saving:', {
          hasUser: !!user,
          hasUserId: !!user?.user_id,
          hasJobId: !!jobId,
          hasCoverLetterText: !!cover_letter_text
        });
      }
    } catch (e) {
      console.error('Cover letter generation failed:', e);
      alert(`Cover letter generation failed:\n${e.message}`);
    }
  };

  const parsed = useMemo(() => {
    const text = raw?.evaluation;
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
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {raw.evaluation || 'No summary available.'}
          </pre>
        )}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary mb-0 btn-3d" onClick=
        {handleDownload}>
          Generate Tailored Cover Letter
        </button>
        <img src="/AlignAI-logo.png" alt="Placeholder" className="alignAI-logo mt-0" />
      </div>
    </div>
  );
}
