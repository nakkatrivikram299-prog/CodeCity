"""
Repository API endpoints (Get repos, Sync GitHub, Public 3D city lookup).
"""
from typing import List, Optional
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.security import get_current_user, get_current_user_optional
from app.database import get_db
from app.models.models import User, Repository, Commit
from app.schemas.schemas import RepositoryResponse, RepositorySyncRequest, CommitResponse
from app.services.github_service import fetch_github_user_repos

router = APIRouter(prefix="/repos", tags=["Repositories"])


@router.get("", response_model=List[RepositoryResponse])
async def get_user_repos(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Repository)
        .options(selectinload(Repository.commits))
        .where(Repository.user_id == current_user.id)
    )
    repos = result.scalars().all()

    if not repos:
        # Auto-seed mock repositories for the user if database is clean
        mock_data = await fetch_github_user_repos(current_user.username)
        db_repos = []
        for item in mock_data:
            repo = Repository(
                user_id=current_user.id,
                github_id=item["githubId"],
                name=item["name"],
                full_name=item["fullName"],
                description=item["description"],
                language=item["language"],
                stars_count=item["starsCount"],
                forks_count=item["forksCount"],
                open_issues_count=item["openIssuesCount"],
                size=item["size"],
                default_branch=item["defaultBranch"],
                district=item["district"],
                is_private=item["isPrivate"],
                topics=json.dumps(item["topics"]),
            )
            db.add(repo)
            await db.flush()

            # Add commits
            for c in item.get("recentCommits", []):
                commit = Commit(
                    repo_id=repo.id,
                    sha=c["sha"],
                    message=c["message"],
                    author_name=c["authorName"],
                    author_email=c["authorEmail"],
                    committed_at=c["committedAt"],
                    additions=c["additions"],
                    deletions=c["deletions"],
                )
                db.add(commit)

            db_repos.append(repo)

        await db.commit()
        # Re-fetch with loaded commits
        result = await db.execute(
            select(Repository)
            .options(selectinload(Repository.commits))
            .where(Repository.user_id == current_user.id)
        )
        repos = result.scalars().all()

    out = []
    for r in repos:
        topics_list = json.loads(r.topics) if r.topics else []
        commits_out = [
            CommitResponse(
                id=c.id,
                sha=c.sha,
                message=c.message,
                authorName=c.author_name,
                authorEmail=c.author_email,
                committedAt=c.committed_at,
                additions=c.additions,
                deletions=c.deletions,
            )
            for c in r.commits[:6]
        ]
        out.append(
            RepositoryResponse(
                id=r.id,
                githubId=r.github_id,
                userId=r.user_id,
                name=r.name,
                fullName=r.full_name,
                description=r.description,
                language=r.language,
                starsCount=r.stars_count,
                forksCount=r.forks_count,
                openIssuesCount=r.open_issues_count,
                size=r.size,
                defaultBranch=r.default_branch,
                district=r.district,
                isPrivate=r.is_private,
                topics=topics_list,
                createdAt=r.created_at,
                updatedAt=r.updated_at,
                recentCommits=commits_out,
            )
        )
    return out


@router.get("/public/{github_username}", response_model=List[RepositoryResponse])
async def get_public_github_city(github_username: str):
    """Dynamically converts ANY public GitHub account into a 3D city skyscraper layout!"""
    repos_data = await fetch_github_user_repos(github_username)
    out = []
    for item in repos_data:
        commits = [
            CommitResponse(
                id=c["id"],
                sha=c["sha"],
                message=c["message"],
                authorName=c["authorName"],
                authorEmail=c.get("authorEmail"),
                committedAt=c["committedAt"],
                additions=c["additions"],
                deletions=c["deletions"],
            )
            for c in item.get("recentCommits", [])
        ]
        out.append(
            RepositoryResponse(
                id=item["id"],
                githubId=item["githubId"],
                userId=f"user-{github_username}",
                name=item["name"],
                fullName=item["fullName"],
                description=item["description"],
                language=item["language"],
                starsCount=item["starsCount"],
                forksCount=item["forksCount"],
                openIssuesCount=item["openIssuesCount"],
                size=item["size"],
                defaultBranch=item["defaultBranch"],
                district=item["district"],
                isPrivate=item["isPrivate"],
                topics=item["topics"],
                createdAt=item["createdAt"],
                updatedAt=item["updatedAt"],
                recentCommits=commits,
            )
        )
    return out


@router.post("/sync", response_model=List[RepositoryResponse])
async def sync_user_repos(
    payload: RepositorySyncRequest = RepositorySyncRequest(),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    target_username = payload.githubUsername or current_user.username
    repos_data = await fetch_github_user_repos(target_username, current_user.github_token)
    return await get_user_repos(current_user, db)
