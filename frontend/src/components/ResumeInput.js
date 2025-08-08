import React, { useState } from 'react';

export default function ResumeInput({ onChange }) {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes("pdf") || file.name.endsWith(".docx"))) {
      onChange(file); // send file to parent handler
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="text-area-box mb-3"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <textarea
        className="form-control border-0"
        placeholder="Paste your resume here or drop a .pdf/.docx file"
        rows="10"
        value={text}
        onChange={handleTextChange}
      />
    </div>
  );
}