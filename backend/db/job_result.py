# JobResult Model

from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from db.session import Base 


class JobResult(Base):
    __tablename__ = "job_results"

    job_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    resume_text = Column(Text, nullable=True)
    evaluation_result = Column(Text, nullable=False)
    applied = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "job_id": str(self.job_id),
            "user_id": self.user_id,
            "company_name": self.company_name,
            "job_title": self.job_title,
            "job_description": self.job_description,
            "resume_text": self.resume_text,
            "evaluation_result": self.evaluation_result,
            "applied": bool(getattr(self, "applied", False)),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
