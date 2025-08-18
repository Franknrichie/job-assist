from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
	DATABASE_URL: str
	OPENAI_API_KEY: str
	JWT_SECRET: str
	JWT_ALGORITHM: str = "HS256"
	ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
	ALLOW_ORIGINS: str = "*"
	ALLOW_ORIGIN_REGEX: Optional[str] = None

	class Config:
		env_file = ".env"

settings = Settings()
