# backend/db/base.py

from db.session import Base

# Intentionally do not import models here to avoid circular imports during application import.
# Alembic will load models via env.py using Base.metadata from db.session.