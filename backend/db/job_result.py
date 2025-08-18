# JobResult Model

from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from .base import Base 


class JobResult(Base):
    __tablename__ = "job_results"

    job_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    resume_text = Column(Text, nullable=True)
    evaluation_result = Column(Text, nullable=False)
    cover_letter = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
