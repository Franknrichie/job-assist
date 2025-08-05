# Job Assist

**Job Assist** is an AI-powered application that helps users evaluate their fit for specific job opportunities and generate tailored cover letters. It compares a user's resume against a job description using natural language reasoning, then outputs a match score, strengths/weaknesses, a summary of fit, and the option to generate a downloadable cover letter.

## Features

- **Upload Resume**  
  Drag and drop `.pdf`, `.docx`, or `.txt` resume files. Extracted text is used for all downstream AI evaluations.

- **Paste Job Description**  
  Copy and paste job descriptions directly from job boards (e.g., Indeed, LinkedIn). URL pasting is not supported in MVP.

- **Applicant Evaluation**  
  After resume and JD submission, the AI:
  - Returns an **Applicant Strength Score** (1–10)
  - Lists **5–7 bullet points** of strengths and gaps
  - Summarizes the overall fit in a **single paragraph**

- **Cover Letter Generation**  
  Users can generate a formal, customized cover letter based on the resume, job description, and AI feedback. The result can be downloaded as `.docx`.

- **User Authentication (JWT)**  
  Registered users can:
  - Save past evaluations
  - View match history (job title, score, summary, bullets, cover letter)
  - Generate and store cover letters tied to evaluations

- **Anonymous Use**  
  Non-logged-in users can still:
  - Upload resume + JD
  - Run AI evaluation
  - View results (not saved)

## Monorepo Structure

```
job-assist/
├── backend/                # FastAPI backend
│   ├── main.py             # FastAPI app entrypoint
│   ├── api/                # Route handlers (upload, evaluate, auth, etc.)
│   ├── core/               # Config, auth, and utility logic
│   ├── models/             # SQLAlchemy models (users, evaluations)
│   ├── db/                 # Postgres + pgvector setup
│   └── prompts/            # Prompt templates for GPT
├── frontend/               # React app (handled by frontend teammate)
├── shared/                 # Shared utils (optional)
├── README.md
└── requirements.txt
```

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, pgvector, JWT, OpenAI API
- **Frontend:** React (drag/drop file input, paste job description, display results)
- **Database:** PostgreSQL with optional `pgvector` for embeddings and history
- **AI Model:** GPT-4 (or compatible LLM) for evaluation and letter generation

## API Endpoints

| Method | Route                   | Auth | Description |
|--------|--------------------------|------|-------------|
| POST   | `/upload_resume`         | ❌    | Upload resume file |
| POST   | `/evaluate_fit`          | ❌    | AI evaluates fit (score + bullets + summary) |
| POST   | `/register`              | ❌    | Create new user |
| POST   | `/login`                 | ❌    | Get JWT token |
| POST   | `/save_evaluation`       | ✅    | Save feedback to user history |
| GET    | `/history`               | ✅    | Fetch past evaluations |
| GET    | `/evaluation/{id}`       | ✅    | Get detailed feedback by ID |
| POST   | `/generate_cover_letter` | ✅    | Generate and store cover letter |
| GET    | `/download/cover-letter/{id}` | ✅ | Download letter as `.docx` |

## Authentication

- Passwords hashed with bcrypt
- JWT tokens returned on login
- Auth-protected routes require `Authorization: Bearer <token>`

## Data Models

### Users
- `id`, `email`, `password_hash`, `created_at`

### Evaluations
- `id`, `user_id`, `job_title`, `score`, `summary`, `bullets`, `has_cover_letter`, `cover_letter`, `created_at`

## Notes

- MVP supports **one job description and resume** at a time
- Project structured for easy extension (multi-job compare, project inputs, etc.)
- Evaluation data is saved only if user is authenticated

---

**Built to help users better understand their fit — and get hired with confidence.**