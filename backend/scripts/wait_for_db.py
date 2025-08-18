import os
import sys
import time

import psycopg2


def wait_for_database(max_wait_seconds: int = 60) -> None:
	"""Block until a connection to DATABASE_URL succeeds or timeout occurs."""
	database_url = os.getenv("DATABASE_URL")
	if not database_url:
		print("DATABASE_URL is not set; cannot wait for database.", flush=True)
		return

	# Normalize SQLAlchemy-style URL to a plain psycopg2 DSN
	if database_url.startswith("postgresql+psycopg2://"):
		database_url = database_url.replace("postgresql+psycopg2://", "postgresql://", 1)

	deadline = time.time() + max_wait_seconds
	last_error: Exception | None = None

	while time.time() < deadline:
		try:
			conn = psycopg2.connect(database_url)
			conn.close()
			print("Database is ready.", flush=True)
			return
		except Exception as exc:  # noqa: BLE001
			last_error = exc
			print(f"Waiting for database... {exc}", flush=True)
			time.sleep(2)

	# If we reach here, we timed out
	print(f"Timed out waiting for database: {last_error}", flush=True)
	sys.exit(1)


if __name__ == "__main__":
	wait_for_database()


