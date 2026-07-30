"""
Main API Router aggregating auth, users, repos, and teams routes.
"""
from fastapi import APIRouter

from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.repos import router as repos_router
from app.api.routes.teams import router as teams_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(repos_router)
api_router.include_router(teams_router)
