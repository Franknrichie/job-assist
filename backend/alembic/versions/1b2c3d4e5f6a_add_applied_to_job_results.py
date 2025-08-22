"""Add applied to job_results

Revision ID: 1b2c3d4e5f6a
Revises: 0ab908870613
Create Date: 2025-08-22 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "1b2c3d4e5f6a"
down_revision = "0ab908870613"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column(
        "job_results",
        sa.Column("applied", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.alter_column("job_results", "applied", server_default=None)

def downgrade() -> None:
    op.drop_column("job_results", "applied")
