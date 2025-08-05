from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.extract_text import extract_text_from_resume

router = APIRouter()

@router.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and DOCX allowed.")

    contents = await file.read()
    text = extract_text_from_resume(file.filename, contents)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from resume.")

    return {"resume_text": text}
