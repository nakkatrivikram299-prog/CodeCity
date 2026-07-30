"""
Authentication routes (Login, Register, Demo, GitHub OAuth, Logout).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.security import hash_password, verify_password, create_access_token, get_current_user_optional
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse, DemoTokenRequest

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=Token)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if username or email exists
    result = await db.execute(select(User).where((User.username == payload.username) | (User.email == payload.email)))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already registered")

    user = User(
        username=payload.username,
        email=payload.email,
        name=payload.name or payload.username,
        hashed_password=hash_password(payload.password),
        avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={payload.username}",
        level=1,
        xp=150,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(subject=user.id)
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where((User.username == payload.username_or_email) | (User.email == payload.username_or_email))
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    token = create_access_token(subject=user.id)
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.post("/demo-token", response_model=Token)
async def demo_token(payload: DemoTokenRequest = DemoTokenRequest(), db: AsyncSession = Depends(get_db)):
    """Creates or returns a demo user token so guests can seamlessly experience CodeCity without registration."""
    username = payload.username or "cyber_architect"
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            username=username,
            name="Neo Architect",
            email=f"{username}@codecity.io",
            avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={username}",
            bio="Cyberpunk Developer & 3D Code City Builder",
            level=12,
            xp=4850,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(subject=user.id)
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user_optional)):
    return {"message": "Logged out successfully"}
