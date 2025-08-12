# Imports and Setup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

# In-Memory Store (TEMP for MVP)
results_db = {}

# Request Model
class SaveResultRequest(BaseModel):
    user_id: str
    company_name: str
    job_title: str
    job_description: str
    evaluation_result: str
    cover_letter: Optional[str] = None

# Save Result Route
@router.post("/save_result")
def save_result(payload: SaveResultRequest):
    job_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, payload.job_description))  # Deterministic UUID

    if payload.user_id not in results_db:
        results_db[payload.user_id] = []

    # Check for existing job ID (avoid duplicate saves for same JD)
    for item in results_db[payload.user_id]:
        if item["job_id"] == job_id:
            raise HTTPException(status_code=400, detail="This job result already exists for the user.")

    results_db[payload.user_id].append({
        "job_id": job_id,
        "company_name": payload.company_name,
        "job_title": payload.job_title,
        "job_description": payload.job_description,
        "evaluation_result": payload.evaluation_result,
        "cover_letter": payload.cover_letter
    })

    return {"message": "Result saved successfully", "job_id": job_id}

# Get Results for a User
@router.get("/results/{user_id}")
def get_results(user_id: str):
    user_results = results_db.get(user_id, [])
    if not user_results:
        raise HTTPException(status_code=404, detail="No results found for this user")
    return {"results": user_results}


