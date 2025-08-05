# Imports and Setup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import uuid
import hashlib

router = APIRouter()

# In-Memory Store (TEMP for MVP)
users_db = {}

# Request Model
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


# Helper: Hash Password
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# Register Route
@router.post("/register")
def register_user(payload: RegisterRequest):
    if payload.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    user_id = str(uuid.uuid4())
    users_db[payload.email] = {
        "id": user_id,
        "email": payload.email,
        "password_hash": hash_password(payload.password)
    }

    return {"message": "User registered successfully", "user_id": user_id}

# Request Model for Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Login Route
@router.post("/login")
def login_user(payload: LoginRequest):
    user = users_db.get(payload.email)

    if not user or user["password_hash"] != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user_id": user["id"]}
