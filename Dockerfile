# Root Dockerfile for Render deployment
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the backend application
COPY backend/ /app/

ENV PYTHONPATH=/app

CMD ["sh", "-c", "python scripts/wait_for_db.py && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
