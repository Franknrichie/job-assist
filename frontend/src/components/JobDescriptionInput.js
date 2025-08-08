import React from 'react';

export default function JobDescriptionInput({ company, setCompany, title, setTitle, description, setDescription }) {
  return (
    <div className="card-like">
      <div className="mb-3">
        <label className="form-label">Company Name</label>
        <input className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Job Title</label>
        <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="form-label">Job Description</label>
        <textarea className="form-control" rows="6" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
    </div>
  );
}