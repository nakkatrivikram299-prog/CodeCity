"""
CodeCity FastAPI Backend Application Entrypoint.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.api.router import api_router
from app.websocket.manager import ws_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print("[CodeCity] Initializing CodeCity Database...")
    try:
        await init_db()
        print("[CodeCity] Database initialized successfully.")
    except Exception as e:
        print(f"[CodeCity] Database initialization warning: {e}")
    yield
    # Shutdown actions
    print("[CodeCity] Shutting down CodeCity API...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Turn a GitHub account into a living futuristic 3D city",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast received events back to all connected clients
            await ws_manager.broadcast({"type": "ping", "data": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
