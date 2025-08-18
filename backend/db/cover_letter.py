from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from db.session import Base


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job_results.job_id"), nullable=False)
    user_id = Column(String, nullable=False)
    cover_letter_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": str(self.id),
            "job_id": str(self.job_id),
            "user_id": self.user_id,
            "cover_letter_text": self.cover_letter_text,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
