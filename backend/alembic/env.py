import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Extend sys.path to include backend folder for absolute imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Ensure Base import works
from db.base import Base

# Load Alembic config
config = context.config

# Override sqlalchemy.url from env DATABASE_URL if present
database_url = os.getenv("DATABASE_URL")
if database_url:
	config.set_main_option("sqlalchemy.url", database_url)

# Enable logging if config file is present
if config.config_file_name is not None:
	fileConfig(config.config_file_name)

# Set target metadata for 'autogenerate'
target_metadata = Base.metadata

# === Offline Migration ===
def run_migrations_offline() -> None:
	url = config.get_main_option("sqlalchemy.url")
	context.configure(
		url=url,
		target_metadata=target_metadata,
		literal_binds=True,
		dialect_opts={"paramstyle": "named"},
	)

	with context.begin_transaction():
		context.run_migrations()

# === Online Migration ===
def run_migrations_online() -> None:
	connectable = engine_from_config(
		config.get_section(config.config_ini_section, {}),
		prefix="sqlalchemy.",
		poolclass=pool.NullPool,
	)

	with connectable.connect() as connection:
		context.configure(
			connection=connection,
			target_metadata=target_metadata,
		)

		with context.begin_transaction():
			context.run_migrations()

# === Entry Point ===
if context.is_offline_mode():
	run_migrations_offline()
else:
	run_migrations_online()
