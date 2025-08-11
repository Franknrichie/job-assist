import React from "react";

export default function JobDescriptionInput({
  company,
  setCompany,
  title,
  setTitle,
  description,
  setDescription
}) {
  return (
    <div className="jd-grid">
      <div className="mb-3">
        <label className="form-label">Company Name</label>
        <input
          className="form-control form-control-lg"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g., Acme Corp"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Job Title</label>
        <input
          className="form-control form-control-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Software Engineer"
        />
      </div>

      <div className="mb-0 d-flex flex-column flex-grow-1">
        <label className="form-label">Job Description</label>
        <textarea
          className="form-control jd-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the job description here"
        />
      </div>
    </div>
  );
}
