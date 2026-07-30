"""
SQLAlchemy ORM models for CodeCity backend.
"""
from datetime import datetime
from typing import List, Optional
import uuid

from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Boolean, Float, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    username: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    github_id: Mapped[Optional[int]] = mapped_column(Integer, unique=True, nullable=True)
    github_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    level: Mapped[int] = mapped_column(Integer, default=1)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    role: Mapped[str] = mapped_column(String(50), default="developer")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    repositories: Mapped[List["Repository"]] = relationship("Repository", back_populates="user", cascade="all, delete-orphan")
    teams: Mapped[List["TeamMember"]] = relationship("TeamMember", back_populates="user", cascade="all, delete-orphan")


class Repository(Base):
    __tablename__ = "repositories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    github_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[Optional[str]] = mapped_column(String(100), default="JavaScript")
    stars_count: Mapped[int] = mapped_column(Integer, default=0)
    forks_count: Mapped[int] = mapped_column(Integer, default=0)
    open_issues_count: Mapped[int] = mapped_column(Integer, default=0)
    size: Mapped[int] = mapped_column(Integer, default=100)  # KB
    default_branch: Mapped[str] = mapped_column(String(100), default="main")
    district: Mapped[str] = mapped_column(String(50), default="frontend")  # frontend | backend | ai | blockchain | security | tools
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    topics: Mapped[Optional[str]] = mapped_column(Text, default="[]")  # JSON array string
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="repositories")
    commits: Mapped[List["Commit"]] = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")


class Commit(Base):
    __tablename__ = "commits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    repo_id: Mapped[str] = mapped_column(String(36), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    sha: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    author_name: Mapped[str] = mapped_column(String(255), nullable=False)
    author_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    committed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    additions: Mapped[int] = mapped_column(Integer, default=0)
    deletions: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="commits")


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    invite_code: Mapped[str] = mapped_column(String(50), unique=True, default=generate_uuid)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    members: Mapped[List["TeamMember"]] = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    team_id: Mapped[str] = mapped_column(String(36), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="member")  # owner | admin | member
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="members")
    user: Mapped["User"] = relationship("User", back_populates="teams")
