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
		sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
	)

	# Create users table
	op.create_table(
		'users',
		sa.Column('id', psql.UUID(as_uuid=True), primary_key=True, nullable=False),
		sa.Column('email', sa.String(), nullable=False),
		sa.Column('password_hash', sa.String(), nullable=False),
		sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
	)
	op.create_unique_constraint('uq_users_email', 'users', ['email'])

	# Create cover_letters table
	op.create_table(
		'cover_letters',
		sa.Column('id', psql.UUID(as_uuid=True), primary_key=True, nullable=False),
		sa.Column('job_id', psql.UUID(as_uuid=True), nullable=False),
		sa.Column('user_id', sa.String(), nullable=False),
		sa.Column('cover_letter_text', sa.Text(), nullable=False),
		sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
	)
	op.create_foreign_key('fk_cover_letters_job_id', 'cover_letters', 'job_results', ['job_id'], ['job_id'])


def downgrade() -> None:
	"""Downgrade schema."""
	op.drop_constraint('fk_cover_letters_job_id', 'cover_letters', type_='foreignkey')
	op.drop_table('cover_letters')
	op.drop_constraint('uq_users_email', 'users', type_='unique')
	op.drop_table('users')
	op.drop_table('job_results')
