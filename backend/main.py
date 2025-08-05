from fastapi import FastAPI
from api.resume_router import router as resume_router



app = FastAPI()
app.include_router(resume_router)

@app.get("/")
def root():
    return {"message": "Job Assist API is live!"}
