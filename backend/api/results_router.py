# backend/api/results_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

# In-Memory Store (TEMP for MVP)
# {
#   user_id: [
#     {
#       job_id, company_name, job_title, job_description,
#       resume_text, evaluation_result, cover_letter (optional)
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
    for r in _get_user_records(user_id):
        if r["job_id"] == job_id:
            return r
    return None

@router.post("/save_result")
def save_result(payload: SaveResultRequest):
    job_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, payload.job_description))  # Deterministic UUID

    if payload.user_id not in results_db:
        results_db[payload.user_id] = []

    # Avoid duplicate saves for the same job description
    for item in results_db[payload.user_id]:
        if item["job_id"] == job_id:
            raise HTTPException(status_code=400, detail="This job result already exists for the user.")

    results_db[payload.user_id].append({
        "job_id": job_id,
        "company_name": payload.company_name,
        "job_title": payload.job_title,
        "job_description": payload.job_description,
        "resume_text": payload.resume_text or "",
        "evaluation_result": payload.evaluation_result,
        "cover_letter": payload.cover_letter  # optional for now
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
    rec["cover_letter"] = payload.cover_letter_text  # store text to mark presence
    return {"message": "Cover letter saved"}