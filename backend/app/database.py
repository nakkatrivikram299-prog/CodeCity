"""
Database engine and session management.

Uses SQLAlchemy 2.0's async ORM with an asyncpg driver. A single engine is
created at import time and shared across the app; sessions are created
per-request via the `get_db` FastAPI dependency and always closed after use.
"""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
    pass


engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG and not settings.is_production,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding a request-scoped async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Creates all tables from the ORM metadata.

    Used for local/dev bootstrap only — production schema changes should go
    through Alembic migrations (see /backend/alembic).
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
