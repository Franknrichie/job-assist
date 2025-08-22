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
from db.cover_letter import CoverLetter

router = APIRouter()

# Request Schemas

class AppliedUpdate(BaseModel):
    applied: bool

class SaveResultRequest(BaseModel):
    user_id: str
    company_name: str
    job_title: str
    job_description: str
    evaluation_result: str
    resume_text: Optional[str] = None

class SaveCoverLetterRequest(BaseModel):
    user_id: str
    job_id: str
    cover_letter_text: str

# Routes 

@router.post("/save_result")
def save_result(payload: SaveResultRequest, db: Session = Depends(get_db)):
    job_id = str(uuid.uuid4())  # Generate unique UUID for each save

    result = JobResult(
        user_id=payload.user_id,
        job_id=job_id,
        company_name=payload.company_name,
        job_title=payload.job_title,
        job_description=payload.job_description,
        resume_text=payload.resume_text or "",
        evaluation_result=payload.evaluation_result,
        created_at=datetime.now(timezone.utc)
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return {"message": "Result saved successfully", "job_id": job_id}


@router.get("/results/{user_id}")
def get_results(user_id: str, db: Session = Depends(get_db)):
    results = db.query(JobResult).filter_by(user_id=user_id).all()
    
    # Get cover letters for each job result
    result_dicts = []
    for result in results:
        result_dict = result.to_dict()
        # Check if there's a cover letter for this job
        cover_letter = db.query(CoverLetter).filter_by(job_id=result.job_id).first()
        result_dict["has_cover_letter"] = cover_letter is not None
        if cover_letter:
            result_dict["cover_letter_created_at"] = cover_letter.created_at.isoformat() if cover_letter.created_at else None
        result_dicts.append(result_dict)
    
    return {"results": result_dicts}

@router.patch("/results/{user_id}/{job_id}/applied")
def update_applied(user_id: str, job_id: str, payload: AppliedUpdate, db: Session = Depends(get_db)):
    rec = db.query(JobResult).filter_by(user_id=user_id, job_id=job_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")
    rec.applied = bool(payload.applied)
    db.commit()
    return {"message": "Applied updated", "job_id": str(rec.job_id), "applied": rec.applied}

@router.post("/save_cover_letter")
def save_cover_letter(payload: SaveCoverLetterRequest, db: Session = Depends(get_db)):
    # Verify the job result exists
    job_result = db.query(JobResult).filter_by(job_id=payload.job_id, user_id=payload.user_id).first()
    if not job_result:
        raise HTTPException(status_code=404, detail="Job result not found")

    # Check if cover letter already exists
    existing = db.query(CoverLetter).filter_by(job_id=payload.job_id).first()
    if existing:
        # Update existing cover letter
        existing.cover_letter_text = payload.cover_letter_text
        existing.created_at = datetime.now(timezone.utc)
        db.commit()
        return {"message": "Cover letter updated successfully"}
    else:
        # Create new cover letter
        cover_letter = CoverLetter(
            job_id=payload.job_id,
            user_id=payload.user_id,
            cover_letter_text=payload.cover_letter_text,
            created_at=datetime.now(timezone.utc)
        )
        db.add(cover_letter)
        db.commit()
        return {"message": "Cover letter saved successfully"}


@router.get("/results/{user_id}/{job_id}/cover_letter.docx")
def download_cover_letter(user_id: str, job_id: str, db: Session = Depends(get_db)):
    cover_letter = db.query(CoverLetter).filter_by(job_id=job_id, user_id=user_id).first()
    if not cover_letter:
        raise HTTPException(status_code=404, detail="No cover letter found for this job")

    doc = Document()
    for para in cover_letter.cover_letter_text.split("\n"):
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
    # Delete cover letter first (due to foreign key constraint)
    cover_letter = db.query(CoverLetter).filter_by(job_id=job_id, user_id=user_id).first()
    if cover_letter:
        db.delete(cover_letter)
    
    # Delete job result
    rec = db.query(JobResult).filter_by(user_id=user_id, job_id=job_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(rec)
    db.commit()
    return {"message": "Record deleted successfully"}
