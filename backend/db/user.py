from sqlalchemy import Column, String, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from db.session import Base


class User(Base):
	__tablename__ = "users"
	__table_args__ = (
		UniqueConstraint("email", name="uq_users_email"),
	)

	id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
	email = Column(String, nullable=False)
	password_hash = Column(String, nullable=False)
	created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


