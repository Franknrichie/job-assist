import io
from typing import Optional
from pdfminer.high_level import extract_text as extract_pdf
import docx

def extract_text_from_resume(filename: str, content: bytes) -> Optional[str]:
    if filename.endswith(".pdf"):
        with io.BytesIO(content) as pdf_file:
            return extract_pdf(pdf_file)
    elif filename.endswith(".docx"):
        with io.BytesIO(content) as docx_file:
            doc = docx.Document(docx_file)
            return "\n".join([para.text for para in doc.paragraphs])
    else:
        return None
