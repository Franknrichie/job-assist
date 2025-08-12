from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
from fastapi.responses import StreamingResponse
from io import BytesIO
import os

# If you used python-docx earlier, reuse it here
try:
    from docx import Document
except Exception:
    Document = None  # only needed if you want to build .docx from saved text

router = APIRouter()

# In-Memory Store (TEMP for MVP)
# {
#   user_id: [
#     {
#       job_id, company_name, job_title, job_description,
#       resume_text, evaluation_result,
#       cover_letter_text (optional)
#     }, ...
#   ]
# }
results_db = {}

class SaveResultRequest(BaseModel):
    user_id: str
    company_name: str
    job_title: str
    job_description: str
    evaluation_result: str
    resume_text: Optional[str] = None
    cover_letter: Optional[str] = None

class SaveCoverLetterRequest(BaseModel):
    user_id: str
    job_id: str
    cover_letter_text: str

def _get_user_records(user_id: str):
    return results_db.setdefault(user_id, [])

def _find_record(user_id: str, job_id: str):
    recs = _get_user_records(user_id)
    for r in recs:
        if r["job_id"] == job_id:
            return r
    return None

@router.post("/save_result")
def save_result(payload: SaveResultRequest):
    job_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, payload.job_description))  # Deterministic UUID
    recs = _get_user_records(payload.user_id)

    # Avoid duplicates for the same JD
    for item in recs:
        if item["job_id"] == job_id:
            raise HTTPException(status_code=400, detail="This job result already exists for the user.")

    recs.append({
        "job_id": job_id,
        "company_name": payload.company_name,
        "job_title": payload.job_title,
        "job_description": payload.job_description,
        "resume_text": payload.resume_text or "",
        "evaluation_result": payload.evaluation_result,
        "cover_letter_text": payload.cover_letter or None
    })

    return {"message": "Result saved successfully", "job_id": job_id}

@router.get("/results/{user_id}")
def get_results(user_id: str):
    return {"results": results_db.get(user_id, [])}

@router.post("/save_cover_letter")
def save_cover_letter(payload: SaveCoverLetterRequest):
    rec = _find_record(payload.user_id, payload.job_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Result not found")
    rec["cover_letter_text"] = payload.cover_letter_text
    return {"message": "Cover letter saved"}

@router.get("/results/{user_id}/{job_id}/cover_letter.docx")
def download_cover_letter(user_id: str, job_id: str):
    rec = _find_record(user_id, job_id)
    if not rec or not rec.get("cover_letter_text"):
        raise HTTPException(status_code=404, detail="No stored cover letter for this record")

    if not Document:
        raise HTTPException(status_code=500, detail="python-docx not installed on the server")

    # Build .docx from stored text
    doc = Document()
    for para in rec["cover_letter_text"].split("\n"):
        doc.add_paragraph(para)

    buf = BytesIO()
    doc.save(buf)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=cover_letter.docx"}
    )
