import React, { useRef } from "react";

export default function ResumeInput({
  value,
  onChange,
  onFileDrop,
  formId = "job-details-form",
  required = true
}) {

  const dropRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove("is-dragover");
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    onFileDrop?.(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.add("is-dragover");
  };

  const handleDragLeave = () => {
    dropRef.current?.classList.remove("is-dragover");
  };

  return (
    <div
      ref={dropRef}
      className="dropzone-wrapper"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="dropzone-inset">
        <textarea
          className="form-control dropzone-textarea"
          placeholder="Paste your resume here or drop a .pdf/.docx file"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          name="resume_text"
          form={formId}
          required={required}
          aria-required={required ? "true" : undefined}
          title="Resume is required"
          pattern=".*\S.*"          
        />
      </div>
    </div>
  );
}
