"""
Team collaboration and Metropolis routes.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.security import get_current_user
from app.database import get_db
from app.models.models import User, Team, TeamMember
from app.schemas.schemas import TeamResponse, TeamCreate, TeamJoin, TeamMemberResponse

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("", response_model=List[TeamResponse])
async def get_my_teams(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Team)
        .join(TeamMember)
        .where(TeamMember.user_id == current_user.id)
        .options(selectinload(Team.members).selectinload(TeamMember.user))
    )
    teams = result.scalars().all()

    if not teams:
        # Default mock team for demonstration
        mock_members = [
            TeamMemberResponse(
                id="tm-1",
                userId=current_user.id,
                username=current_user.username,
                name=current_user.name,
                avatarUrl=current_user.avatar_url,
                role="owner",
                joinedAt=current_user.created_at,
            ),
            TeamMemberResponse(
                id="tm-2",
                userId="u-gaearon",
                username="gaearon",
                name="Dan Abramov",
                avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=gaearon",
                role="member",
                joinedAt=current_user.created_at,
            ),
            TeamMemberResponse(
                id="tm-3",
                userId="u-antfu",
                username="antfu",
                name="Anthony Fu",
                avatarUrl="https://api.dicebear.com/7.x/bottts/svg?seed=antfu",
                role="member",
                joinedAt=current_user.created_at,
            ),
        ]
        return [
            TeamResponse(
                id="team-alpha-metropolis",
                name="Cyber Architects Guild",
                description="A high-density open-source developer metropolis combining engineering talent.",
                ownerId=current_user.id,
                inviteCode="CYBER-2026-GUILD",
                membersCount=3,
                members=mock_members,
                createdAt=current_user.created_at,
            )
        ]

    out = []
    for t in teams:
        members_out = [
            TeamMemberResponse(
                id=m.id,
                userId=m.user.id,
                username=m.user.username,
                name=m.user.name,
                avatarUrl=m.user.avatar_url,
                role=m.role,
                joinedAt=m.joined_at,
            )
            for m in t.members
        ]
        out.append(
            TeamResponse(
                id=t.id,
                name=t.name,
                description=t.description,
                ownerId=t.owner_id,
                inviteCode=t.invite_code,
                membersCount=len(t.members),
                members=members_out,
                createdAt=t.created_at,
            )
        )
    return out


@router.post("", response_model=TeamResponse)
async def create_team(payload: TeamCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    team = Team(
        name=payload.name,
        description=payload.description,
        owner_id=current_user.id,
    )
    db.add(team)
    await db.flush()

    member = TeamMember(
        team_id=team.id,
        user_id=current_user.id,
        role="owner",
    )
    db.add(member)
    await db.commit()

    return TeamResponse(
        id=team.id,
        name=team.name,
        description=team.description,
        ownerId=team.owner_id,
        inviteCode=team.invite_code,
        membersCount=1,
        members=[
            TeamMemberResponse(
                id=member.id,
                userId=current_user.id,
                username=current_user.username,
                name=current_user.name,
                avatarUrl=current_user.avatar_url,
                role="owner",
                joinedAt=member.joined_at,
            )
        ],
        createdAt=team.created_at,
    )
