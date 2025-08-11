from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.resume_router import router as resume_router
from api.eval_router import router as eval_router
from api.auth_router import router as auth_router
from api.results_router import router as results_router



app = FastAPI()

# CORS Allow React dev server
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # for dev; tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI Routes
app.include_router(resume_router)
app.include_router(eval_router)
app.include_router(auth_router)
app.include_router(results_router)


@app.get("/")
def root():
    return {"message": "Job Assist API is live!"}
