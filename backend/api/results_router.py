from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from io import BytesIO
from docx import Document
from typing import Optional
from datetime import datetime, timezone
import uuid

from db.session import get_db
from db.job_result import JobResult

router = APIRouter()

# Request Schemas

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

# Routes 

@router.post("/save_result")
def save_result(payload: SaveResultRequest, db: Session = Depends(get_db)):
    job_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, payload.job_description))  # Deterministic UUID

    existing = db.query(JobResult).filter_by(user_id=payload.user_id, job_id=job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="This job result already exists for the user.")

    result = JobResult(
        user_id=payload.user_id,
        job_id=job_id,
        company_name=payload.company_name,
        job_title=payload.job_title,
        job_description=payload.job_description,
        resume_text=payload.resume_text or "",
        evaluation_result=payload.evaluation_result,
        cover_letter=payload.cover_letter,
        created_at=datetime.now(timezone.utc)
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return {"message": "Result saved successfully", "job_id": job_id}


@router.get("/results/{user_id}")
def get_results(user_id: str, db: Session = Depends(get_db)):
    results = db.query(JobResult).filter_by(user_id=user_id).all()
    return {"results": [r.to_dict() for r in results]}


@router.post("/save_cover_letter")
def save_cover_letter(payload: SaveCoverLetterRequest, db: Session = Depends(get_db)):
    rec = db.query(JobResult).filter_by(user_id=payload.user_id, job_id=payload.job_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Result not found")

    rec.cover_letter = payload.cover_letter_text
    db.commit()
    return {"message": "Cover letter saved"}


@router.get("/results/{user_id}/{job_id}/cover_letter.docx")
def download_cover_letter(user_id: str, job_id: str, db: Session = Depends(get_db)):
    rec = db.query(JobResult).filter_by(user_id=user_id, job_id=job_id).first()
    if not rec or not rec.cover_letter:
        raise HTTPException(status_code=404, detail="No stored cover letter for this record")

    doc = Document()
    for para in rec.cover_letter.split("\n"):
        doc.add_paragraph(para)

    buf = BytesIO()
    doc.save(buf)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=cover_letter.docx"}
    )


@router.delete("/results/{user_id}/{job_id}")
def delete_result(user_id: str, job_id: str, db: Session = Depends(get_db)):
    rec = db.query(JobResult).filter_by(user_id=user_id, job_id=job_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(rec)
    db.commit()
    return {"message": "Record deleted successfully"}
