# CodeCity

Turn a GitHub account into a living, futuristic 3D city — every repository a skyscraper,
every commit a light in the skyline.

## Stack

- **Frontend**: React 18, Vite, React Router, React Three Fiber + Drei, Framer Motion, Tailwind CSS, Recharts, React Query
- **Backend**: FastAPI, SQLAlchemy 2.0 (async), Alembic, PostgreSQL, JWT, GitHub OAuth2, WebSockets

## Local setup

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in SECRET_KEY + GitHub OAuth app credentials
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_GITHUB_CLIENT_ID to match your OAuth app
npm run dev
```

You'll need a GitHub OAuth App (Settings → Developer settings → OAuth Apps) with
callback URL `http://localhost:5173/auth/callback`, and a running PostgreSQL instance
matching `DATABASE_URL`.

## Build status

This project is being generated file-by-file, largest/most central first.

- [x] Project scaffold (configs, entry points, auth wiring)
- [ ] `CityScene.jsx` — the 3D city
- [ ] `Building.jsx` — a single repository skyscraper
- [ ] `Dashboard.jsx`
- [ ] `Profile.jsx`
- [ ] `Team.jsx`
- [ ] `Leaderboard.jsx`
- [ ] Backend: `main.py`, `github_service.py`, WebSocket manager, routes, models
"# CodeCity" 
"# CodeCity" 
