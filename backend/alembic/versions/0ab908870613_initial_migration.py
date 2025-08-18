"""Initial migration

Revision ID: 0ab908870613
Revises: 
Create Date: 2025-08-14 08:39:07.432887

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as psql


# revision identifiers, used by Alembic.
revision: str = '0ab908870613'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
	"""Upgrade schema."""
	# Create job_results table
	op.create_table(
		'job_results',
		sa.Column('job_id', psql.UUID(as_uuid=True), primary_key=True, nullable=False),
		sa.Column('user_id', sa.String(), nullable=False),
		sa.Column('company_name', sa.String(), nullable=False),
		sa.Column('job_title', sa.String(), nullable=False),
		sa.Column('job_description', sa.Text(), nullable=False),
		sa.Column('resume_text', sa.Text(), nullable=True),
		sa.Column('evaluation_result', sa.Text(), nullable=False),
		sa.Column('cover_letter', sa.Text(), nullable=True),
		sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
	)


def downgrade() -> None:
	"""Downgrade schema."""
	op.drop_table('job_results')
