const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function registerUser(email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function evaluateFit(data) {
  const res = await fetch(`${BASE_URL}/evaluate_fit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function generateCoverLetter(data, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/generate_cover_letter`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function downloadCoverLetterDocx(data, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/download_cover_letter_docx`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.blob();
}

export async function saveResult(data, token) {
  const res = await fetch(`${BASE_URL}/save_result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text(); // <- show FastAPI detail
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchResults(userId, token) {
  const res = await fetch(`${BASE_URL}/results/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export async function deleteResult(userId, jobId, token) {
  const res = await fetch(`${BASE_URL}/results/${userId}/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function saveCoverLetter(userId, jobId, coverLetterText, token) {
  const res = await fetch(`${BASE_URL}/save_cover_letter`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: userId, job_id: jobId, cover_letter_text: coverLetterText })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function downloadCoverLetterUrl(userId, jobId) {
  return `${BASE_URL}/results/${userId}/${jobId}/cover_letter.docx`;
}

export async function uploadResume(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/upload_resume`, {
    method: 'POST',
    body: form
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function updateApplied(userId, jobId, applied) {
  const res = await fetch(`${BASE_URL}/results/${userId}/${jobId}/applied`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applied })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}
