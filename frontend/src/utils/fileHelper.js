// Placeholder for future drag/drop resume parsing
// Currently unused but reserved for expanding file parsing logic

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Example: convert .docx to text or extract raw text from PDF
// Requires third-party libraries like mammoth or pdfjs — can be added later