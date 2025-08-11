import React, { useState, useRef } from "react";

export default function ResumeInput({ onChange }) {
  const [text, setText] = useState("");
  const dropRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current?.classList.remove("is-dragover");
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type.includes("pdf") || file.name?.toLowerCase().endsWith(".docx")) {
      onChange(file); // give parent the File for future upload flow
    }
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
          value={text}
          onChange={handleTextChange}
        />
      </div>
    </div>
  );
}
