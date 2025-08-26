import React from "react";

export default function JobDescriptionInput({
  company,
  setCompany,
  title,
  setTitle,
  description,
  setDescription,
  onSubmit,
  formId = "job-details-form"
}) {
  return (
    <form id={formId} className="jd-grid" onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Company Name</label>
        <input
          className="form-control form-control-lg"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g., Acme Corp"
          name="company"
          required
          aria-required="true"
          autoComplete="organization"
          pattern="\S+.*"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Job Title</label>
        <input
          className="form-control form-control-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Software Engineer"
          name="job_title"
          required
          aria-required="true"
          autoComplete="organization-title"
          pattern="\S+.*"         
        />
      </div>

      <div className="mb-0 d-flex flex-column flex-grow-1">
        <label className="form-label">Job Description</label>
        <textarea
          className="form-control jd-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the job description here"
          name="job_description"
          required
          aria-required="true"
          pattern="\S+.*"
        />
      </div>
    </form>
  );
}
