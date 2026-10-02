"""
Application configuration using Pydantic settings.
"""

import secrets
from typing import List

from pydantic import computed_field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os


class Settings(BaseSettings):
    """Application settings."""

    # Project
    PROJECT_NAME: str = "AI FinOps Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    # Database
    DATABASE_URL: str | None = os.getenv("DATABASE_URL")
    POSTGRES_SERVER: str | None = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str | None = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str | None = os.getenv("POSTGRES_PASSWORD", "admin@123")
    POSTGRES_DB: str | None = os.getenv("POSTGRES_DB", "mydatabase")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        from urllib.parse import quote_plus
        user = quote_plus(self.POSTGRES_USER or "")
        password = quote_plus(self.POSTGRES_PASSWORD or "")
        return (
            f"postgresql://{user}:{password}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # Agent auth
    AGENT_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS & Hosts
    ALLOWED_HOSTS: List[str] = ["*"]
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()