"""
Centralized application configuration.

All runtime configuration is sourced from environment variables (or a local
.env file in development) via pydantic-settings, so the same code base can
run identically across local, staging, and production without code changes.
"""
from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings, validated at startup."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Core ---
    APP_NAME: str = "CodeCity API"
    ENVIRONMENT: str = Field(default="development")  # development | staging | production
    DEBUG: bool = Field(default=True)
    API_V1_PREFIX: str = "/api"

    # --- Security / JWT ---
    SECRET_KEY: str = Field(default="codecity-secret-key-super-secure-change-in-production-2026", description="Used to sign JWTs. Must be set in production.")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30d

    # --- Database ---
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./codecity.db",
        description="Async SQLAlchemy connection string.",
    )
    DATABASE_SYNC_URL: str = Field(
        default="sqlite:///./codecity.db",
        description="Sync connection string, used by Alembic migrations.",
    )
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # --- Redis (caching, rate limiting, websocket fan-out) ---
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # --- GitHub OAuth ---
    GITHUB_CLIENT_ID: str = Field(default="")
    GITHUB_CLIENT_SECRET: str = Field(default="")
    GITHUB_OAUTH_REDIRECT_URI: str = Field(default="http://localhost:5173/auth/callback")
    GITHUB_API_BASE_URL: str = "https://api.github.com"
    GITHUB_TOKEN_URL: str = "https://github.com/login/oauth/access_token"

    # --- CORS ---
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:5173"])

    # --- Rate limiting ---
    RATE_LIMIT_DEFAULT: str = "100/minute"
    RATE_LIMIT_GITHUB_PROXY: str = "30/minute"

    # --- Frontend ---
    FRONTEND_URL: AnyHttpUrl = Field(default="http://localhost:5173")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _split_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


@lru_cache
def get_settings() -> Settings:
    """Returns a cached Settings instance so env parsing only happens once."""
    return Settings()


settings = get_settings()
