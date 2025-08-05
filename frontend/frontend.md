# Frontend Developer Guide

Welcome to the `job-assist` project! This guide will help you get started quickly and understand what’s already built, how to use the backend, and what’s left to build on the frontend.

---

## What’s Already Done

### Backend API Routes (Fully Working)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/register` | POST | Register new user |
| `/login` | POST | Login and get user ID |
| `/evaluate_fit` | POST | Analyze resume vs job description |
| `/generate_cover_letter` | POST | Generate a personalized cover letter |
| `/save_result` | POST | Save a job application result |
| `/results/{user_id}` | GET | Get all saved results for a user |

### Storage & Infrastructure

- PostgreSQL setup using Docker (via `docker-compose`)
- Data persistence for job results is working
- FastAPI auto-generated docs are live at `http://localhost:8000/docs`

---

## How to Run Locally

Make sure you have Docker and Docker Compose installed.

```bash
# From the project root
docker-compose up --build
```

Visit the FastAPI docs to test endpoints manually:
```
http://localhost:8000/docs
```

---

## Your Frontend To-Do List

### Pages / Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/signup` | SignupForm | POST to `/register` |
| `/login` | LoginForm | POST to `/login` → store user_id in session |
| `/dashboard` | Dashboard | Fetch `/results/{user_id}` and display saved job applications |
| `/submit` | SubmitJob | POST resume + job description → get eval + cover letter → optionally POST to `/save_result` |

### Components

- `ResumeInputForm`
- `JobDescriptionInputForm`
- `GeneratedOutputDisplay` (shows eval + cover letter)
- `SavedResultsList` (on dashboard)

### Auth Handling

- Use `sessionStorage` to store `user_id` from login
- Pass `user_id` when saving or retrieving results

---

## Testing API Without Frontend

You can test all the backend routes directly via Swagger UI:
```
http://localhost:8000/docs
```

---

## Later (for deployment)

These are not needed for now but will be tackled before production:
- PostgreSQL-backed user authentication (replacing in-memory storage)
- JWT login system (for protected routes)
- Full production Docker setup + environment config

---

Let me know if you hit any blockers or want help building components!