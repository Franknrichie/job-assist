from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from io import BytesIO
from dotenv import load_dotenv
from openai import OpenAI
from docx import Document
import os

# Load API key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

# Request Models
class EvaluationRequest(BaseModel):
    resume_text: str
    job_description: str

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str

# === Evaluate Fit ===
@router.post("/evaluate_fit")
def evaluate_fit(payload: EvaluationRequest):
    system_prompt = {
        "role": "system",
        "content": (
            "You are an AI job application evaluator.\n"
            "Base your evaluation only on clearly stated information in the resume.\n"
            "You may draw reasonable connections between professional roles and relevant domains "
            "if the connection is clearly implied by the role.\n"
            "Do not assume or invent technical skills, tools, or certifications that are not explicitly listed."
        )
    }

    user_prompt = f"""
You are an AI job application evaluator.

Compare the following resume and job description.

Only use information that is explicitly stated in the resume.
Do not infer, guess, or assume any experience, skills, or tools that are not clearly listed.

Give:
1. A score from 1–10 representing overall fit
2. A total of 5–7 bullet points in a single section labeled "Alignments and Gaps:"
   - First list all alignments, each starting with "Alignment:"
   - Then list all gaps, each starting with "Gap:"
   - Do not mix them. Keep all alignments first, then all gaps.
3. A one-paragraph summary of how well the applicant fits the job

Resume:
\"\"\"
{payload.resume_text}
\"\"\"

Job Description:
\"\"\"
{payload.job_description}
\"\"\"

Respond in this exact format:
---
Score: <1-10>

Alignments and Gaps:
- Alignment: ...
- Gap: ...

Summary:
<One paragraph summary>

Use plain text. Do not use Markdown. Each bullet must start with `- Alignment:` or `- Gap:` exactly.
---
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_prompt, {"role": "user", "content": user_prompt}],
            temperature=0.3
        )
        return {"evaluation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === Generate Cover Letter (text only, for saving) ===
@router.post("/generate_cover_letter")
def generate_cover_letter(payload: CoverLetterRequest):
    system_prompt = {
        "role": "system",
        "content": (
            "You are a professional cover letter writer.\n"
            "Your job is to create customized, compelling, and natural-sounding cover letters that reflect the candidate’s background.\n"
            "The tone should be confident, human, and mission-aligned — not robotic or generic.\n"
            "Only use information stated in the resume."
        )
    }

    user_prompt = f"""
Based on the following resume and job description, write a compelling one-page cover letter tailored to the company: {payload.company_name}.

Resume:
\"\"\"
{payload.resume_text}
\"\"\"

Job Description:
\"\"\"
{payload.job_description}
\"\"\"

Guidelines:
- Start with a strong, natural intro paragraph.
- Mention relevant experiences and strengths pulled from the resume.
- Align tone with the company mission (health, tech, education, etc.).
- End with a warm and confident closing paragraph.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_prompt, {"role": "user", "content": user_prompt}],
            temperature=0.5
        )
        cover_text = response.choices[0].message.content.strip()
        return {"cover_letter_text": cover_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === Download Cover Letter as .docx ===
@router.post("/download_cover_letter_docx")
def download_cover_letter_docx(payload: CoverLetterRequest):
    system_prompt = {
        "role": "system",
        "content": (
            "You are a professional cover letter writer.\n"
            "Your job is to create customized, compelling, and natural-sounding cover letters that reflect the candidate’s background.\n"
            "The tone should be confident, human, and mission-aligned — not robotic or generic.\n"
            "Only use information stated in the resume."
        )
    }

    user_prompt = f"""
Based on the following resume and job description, write a compelling one-page cover letter tailored to the company: {payload.company_name}.

Resume:
\"\"\"
{payload.resume_text}
\"\"\"

Job Description:
\"\"\"
{payload.job_description}
\"\"\"

Guidelines:
- Start with a strong, natural intro paragraph.
- Mention relevant experiences and strengths pulled from the resume.
- Align tone with the company mission (health, tech, education, etc.).
- End with a warm and confident closing paragraph.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_prompt, {"role": "user", "content": user_prompt}],
            temperature=0.5
        )
        cover_text = response.choices[0].message.content.strip()

        # Convert to valid docx
        doc = Document()
        for paragraph in cover_text.split("\n\n"):
            doc.add_paragraph(paragraph.strip())

        file_stream = BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)

        return StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": "attachment; filename=cover_letter.docx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
