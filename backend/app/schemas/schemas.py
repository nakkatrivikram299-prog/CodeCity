"""
Pydantic schemas for validation and API request/response serialisation.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: str = Field(..., min_length=6)
    name: Optional[str] = None


class UserLogin(BaseModel):
    username_or_email: str
    password: str


class DemoTokenRequest(BaseModel):
    username: Optional[str] = "demo_architect"


# --- User ---
class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    name: Optional[str] = None
    avatarUrl: Optional[str] = None
    bio: Optional[str] = None
    level: int = 1
    xp: int = 0
    role: str = "developer"
    createdAt: datetime

    class Config:
        from_attributes = True


class UserStatsResponse(BaseModel):
    totalRepos: int
    totalCommits: int
    totalStars: int
    totalForks: int
    topLanguage: str
    level: int
    xp: int
    xpToNextLevel: int
    streakDays: int


# --- Repository ---
class CommitResponse(BaseModel):
    id: str
    sha: str
    message: str
    authorName: str
    authorEmail: Optional[str] = None
    committedAt: datetime
    additions: int
    deletions: int

    class Config:
        from_attributes = True


class RepositoryResponse(BaseModel):
    id: str
    githubId: Optional[int] = None
    userId: str
    name: str
    fullName: str
    description: Optional[str] = None
    language: str
    starsCount: int
    forksCount: int
    openIssuesCount: int
    size: int
    defaultBranch: str
    district: str
    isPrivate: bool
    topics: List[str] = []
    createdAt: datetime
    updatedAt: datetime
    recentCommits: Optional[List[CommitResponse]] = []

    class Config:
        from_attributes = True


class RepositorySyncRequest(BaseModel):
    githubUsername: Optional[str] = None


# --- Team ---
class TeamMemberResponse(BaseModel):
    id: str
    userId: str
    username: str
    name: Optional[str] = None
    avatarUrl: Optional[str] = None
    role: str
    joinedAt: datetime


class TeamResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    ownerId: str
    inviteCode: str
    membersCount: int
    members: List[TeamMemberResponse] = []
    createdAt: datetime

    class Config:
        from_attributes = True


class TeamCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None


class TeamJoin(BaseModel):
    inviteCode: str
