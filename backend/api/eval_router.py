from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import os
from io import BytesIO

# Optional OpenAI imports if not using dummy mode
USE_DUMMY_AI = os.getenv("USE_DUMMY_AI", "0") == "1"
if not USE_DUMMY_AI:
    from dotenv import load_dotenv
    from openai import OpenAI
    load_dotenv()
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
else:
    # For dummy docx generation
    from docx import Document

router = APIRouter()

# Request Models
class EvaluationRequest(BaseModel):
    resume_text: str
    job_description: str

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: str


def _dummy_evaluation(resume_text: str, job_description: str) -> dict:
    sample = """---
Score: 7

Alignments and Gaps:
- Alignment: Relevant experience overlaps with job requirements.
- Alignment: Demonstrated problem-solving and cross-functional collaboration.
- Alignment: Familiarity with modern tooling and documentation.
- Gap: Specific platform or tool not explicitly listed in resume.
- Gap: Limited direct experience with one or more required systems.

Summary:
Overall, the candidate appears to be a good match with room to grow in a few areas. The background suggests strong fundamentals and adaptability, with some targeted upskilling recommended for an excellent fit.
---"""
    return {"evaluation": sample}


def _dummy_cover_letter_docx(company_name: str) -> StreamingResponse:
    # Create an in-memory .docx
    doc = Document()
    doc.add_paragraph(f"Dear Hiring Team at {company_name},")
    doc.add_paragraph(
        "I’m excited to apply for this role. My background shows a consistent track record of solving "
        "technical problems, supporting teams, and documenting processes clearly. The position’s focus on "
        "reliable execution and thoughtful collaboration aligns well with how I approach my work."
    )
    doc.add_paragraph(
        "In my recent experience, I supported cross-functional stakeholders, analyzed issues to get to "
        "root cause, and communicated findings concisely. I’m comfortable learning new tools quickly "
        "and improving workflows where it helps the team succeed. I’d welcome the chance to contribute "
        "that same energy and ownership here."
    )
    doc.add_paragraph("Thank you for your time and consideration.")
    doc.add_paragraph("Sincerely,\nYour Candidate")

    file_stream = BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    return StreamingResponse(
        file_stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=cover_letter.docx"}
    )


# evaluate_fit Route
@router.post("/evaluate_fit")
def evaluate_fit(payload: EvaluationRequest):
    if USE_DUMMY_AI:
        return _dummy_evaluation(payload.resume_text, payload.job_description)

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


# generate_cover_letter Route
@router.post("/generate_cover_letter")
def generate_cover_letter(payload: CoverLetterRequest):
    if USE_DUMMY_AI:
        return _dummy_cover_letter_docx(payload.company_name)

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
        return {"cover_letter": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
