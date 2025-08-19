
# Job Assist

**Job Assist** is an AI-powered application that helps users evaluate their fit for specific job opportunities and generate tailored cover letters. It compares a user's resume against a job description using natural language reasoning, then outputs a match score, strengths/weaknesses, a summary of fit, and the option to generate a downloadable cover letter.

## 🚀 Live Application

- **Frontend**: [https://job-assist-chi.vercel.app](https://job-assist-chi.vercel.app)
- **Backend API**: [https://job-assist.onrender.com](https://job-assist.onrender.com)
- **API Documentation**: [https://job-assist.onrender.com/docs](https://job-assist.onrender.com/docs)

## Features

- **Resume Upload**  
  Drag and drop `.pdf`, `.docx`, or `.txt` resume files. Extracted text is used for all downstream AI evaluations.

- **Job Description Input**  
  Copy and paste job descriptions directly from job boards (e.g., Indeed, LinkedIn). URL pasting is not supported in MVP.

- **AI-Powered Evaluation**  
  After resume and job description submission, the AI:
  - Returns an **Applicant Strength Score** (1–10)
  - Lists **5–7 bullet points** of strengths and gaps
  - Summarizes the overall fit in a **single paragraph**

- **Cover Letter Generation**  
  Users can generate formal, customized cover letters based on the resume, job description, and AI feedback. Results can be downloaded as `.docx` files.

- **User Authentication**  
  Registered users can:
  - Save past evaluations
  - View saved results (score, summary, bullet points, cover letter)
  - Generate and store cover letters tied to evaluations
  - Delete unwanted records

- **Anonymous Use**  
  Non-logged-in users can still:
  - Upload resume + job description
  - Run AI evaluation
  - View results (not saved)

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, bcrypt, OpenAI API
- **Frontend:** React, Bootstrap, React Router
- **Database:** PostgreSQL with Alembic migrations
- **AI Model:** GPT-3.5-turbo for evaluation and letter generation
- **Deployment:** Docker Compose (local), Render (backend), Vercel (frontend)

## Project Structure

```
job-assist/
├── backend/                # FastAPI backend
│   ├── main.py             # FastAPI app entrypoint
│   ├── api/                # Route handlers (auth, eval, results, resume)
│   ├── core/               # Configuration and settings
│   ├── db/                 # Database models and session
│   ├── scripts/            # Database wait script
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth context
│   │   └── api.js          # API client
│   ├── Dockerfile          # Frontend container
│   └── nginx.conf          # Nginx configuration
├── docker-compose.yml      # Local development setup
└── README.md
```

## API Endpoints

| Method | Route                    | Auth | Description |
|--------|--------------------------|------|-------------|
| POST   | `/upload_resume`         | ❌    | Upload resume file |
| POST   | `/evaluate_fit`          | ❌    | AI evaluates fit (score + bullets + summary) |
| POST   | `/register`              | ❌    | Create new user |
| POST   | `/login`                 | ❌    | Get JWT token |
| POST   | `/save_result`           | ✅    | Save evaluation result |
| GET    | `/results/{user_id}`     | ✅    | Fetch all saved results |
| DELETE | `/results/{user_id}/{job_id}` | ✅ | Delete specific result |
| POST   | `/generate_cover_letter` | ✅    | Generate tailored cover letter |
| POST   | `/download_cover_letter_docx` | ✅ | Download cover letter as .docx |
| POST   | `/save_cover_letter`      | ✅    | Save cover letter to database |
| GET    | `/results/{user_id}/{job_id}/cover_letter.docx` | ✅ | Download saved cover letter |

## Data Models

### Users
- `id` (UUID), `email`, `password_hash`, `created_at`

### Job Results
- `job_id` (UUID), `user_id`, `company_name`, `job_title`, `job_description`, `resume_text`, `evaluation_result`, `created_at`

### Cover Letters
- `id` (UUID), `job_id` (FK), `user_id`, `cover_letter_text`, `created_at`

## Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Cyberbot777/job-assist.git
   cd job-assist
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in project root
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   echo "JWT_SECRET=your_jwt_secret_here" >> .env
   ```

3. **Start the application**
   ```bash
   docker compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Database Management

- **View tables**: `docker compose exec db psql -U postgres -d jobassist -c "\dt"`
- **Check users**: `docker compose exec db psql -U postgres -d jobassist -c "SELECT id, email FROM users;"`
- **Check results**: `docker compose exec db psql -U postgres -d jobassist -c "SELECT job_id, company_name, job_title FROM job_results;"`
- **Check cover letters**: `docker compose exec db psql -U postgres -d jobassist -c "SELECT job_id, created_at FROM cover_letters;"`

## Deployment

### Backend (Render)

1. **Create a new Web Service**
   - Connect your GitHub repository
   - Root Directory: Leave empty (uses repo root)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_secure_jwt_secret
   ALLOW_ORIGINS=https://job-assist-chi.vercel.app
   ALLOW_ORIGIN_REGEX=^https://.*-job-assist.*\.vercel\.app$
   ```

### Frontend (Vercel)

1. **Import your GitHub repository**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://job-assist.onrender.com
   ```

### Database (Render PostgreSQL)

1. **Create a PostgreSQL instance**
2. **Copy the Internal Connection String** to your backend's `DATABASE_URL`
3. **Ensure SSL mode is included** in the connection string

## Development Notes

- **Authentication**: Uses bcrypt for password hashing and JWT for session management
- **CORS**: Configured to allow frontend domains and Vercel preview URLs
- **Database**: Auto-migrates on startup using Alembic
- **File Upload**: Supports PDF and DOCX resume formats
- **Error Handling**: Comprehensive error responses with detailed messages
- **Cover Letters**: Stored in separate table with timestamps for better data organization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with Docker Compose
5. Submit a pull request

---

**Built to help users better understand their fit — and get hired with confidence.**
