from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Job Assist API is live!"}
