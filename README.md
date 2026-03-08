# 🏙️ CodeCity — HackFusion 2026

A real-time 3D city visualization for hackathons where each team's GitHub project becomes a **Dubai-style skyscraper**. The more commits, the taller the building.

---

## 🚀 How to Run

### Prerequisites
- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **npm** v8+ (comes with Node.js)

### Step 1 — Install dependencies
```bash
cd codecity-app
npm install
```

### Step 2 — (Optional) GitHub API token
For higher rate limits and private repos, create a `.env` file:
```bash
# codecity-app/.env
VITE_GITHUB_TOKEN=ghp_yourPersonalAccessTokenHere
```
Get a token: GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained or Classic.  
Without a token, the public API allows **60 requests/hour** — enough for demo use.

### Step 3 — Start the dev server
```bash
npm run dev
```
Open your browser at: **http://localhost:3000**

### Step 4 — Build for production
```bash
npm run build
npm run preview   # preview the built app
```

---

## 👤 Registering as a User

1. Click **Register** on the login screen
2. **Step 1** — Enter your name, email, and password
3. **Step 2** — Enter your team name, project name, and choose a district:
   - 🔵 **AI** — Machine learning, NLP, computer vision projects
   - 🩷 **WEB** — Web apps, APIs, frontend/backend projects  
   - 🟢 **MOBILE** — iOS, Android, React Native, Flutter projects
   - 🟡 **BLOCKCHAIN** — Web3, DeFi, smart contract projects
4. **Step 3** — Paste your **GitHub repository URL**:
   ```
   https://github.com/your-username/your-project
   ```
   Click **FETCH** — the app reads your real GitHub stats (commits, stars, contributors, languages)
5. Preview your scores and click **🏙️ Build My Building**

Your building appears instantly in the city, sized by your actual GitHub activity!

---

## 🎮 City Controls

| Key / Action | Effect |
|---|---|
| **W A S D** | Fly forward / backward / strafe |
| **Mouse drag** | Look around 360° |
| **Scroll wheel** | Move forward / back |
| **E / Space** | Fly up |
| **C / Q** | Fly down |
| **Shift** | Sprint (3× speed) |
| **Click building** | View team stats |
| **☀️ 🌅 🌙 buttons** | Toggle day / dusk / night |

---

## 🏗️ How Scores Are Calculated

| Metric | Source | Weight |
|---|---|---|
| **Commits** | GitHub API `/commits` | 40% of overall score |
| **Code Quality** | Stars, forks, descriptions | 30% of overall score |
| **Innovation** | Language diversity, topics, stars | 30% of overall score |
| **Documentation** | Description, wiki, GitHub Pages | Displayed separately |
| **Testing** | Commit frequency, file diversity | Displayed separately |
| **Collaboration** | Contributor count, forks, issues | Displayed separately |

> Building height = `36 + (score / 100) × 148` units

---

## 📁 Project Structure

```
codecity-app/
├── index.html                    # HTML entry point
├── vite.config.js                # Vite build configuration
├── package.json                  # Dependencies
├── .env                          # (Optional) GitHub token
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # State-based routing + auth check
    ├── pages/
    │   ├── AuthPage.jsx          # Login + 3-step registration
    │   └── CityPage.jsx          # Main 3D city dashboard
    ├── components/
    │   ├── CityScene.jsx         # Three.js 3D scene (Dubai buildings + roundabout)
    │   └── Panels.jsx            # Live log + leaderboard panels
    ├── utils/
    │   ├── github.js             # GitHub REST API integration
    │   ├── storage.js            # localStorage user management
    │   └── textures.js           # Canvas-based texture generators
    └── data/
        └── teams.js              # 16 default hackathon teams
```

---

## 🏛️ District Architecture

Each district has **Dubai-style towers** with 6 unique architectural styles:
1. **Tapered Needle** — Rose Tower style, setback floors + spire
2. **Twisted Cylinder** — Cayan Tower style, 42° full rotation
3. **Arch Crown** — Emirates Crown style, horseshoe arch top
4. **Sail + Exo-frame** — Princess Tower style, structural fin columns
5. **Octagonal Diamond** — 23 Marina style, geometric crown
6. **Twin Towers** — DAMAC Towers style, sky bridge at 62%

The central **Lisbon-style roundabout** features:
- 3 concentric dense tree rings
- 12 radial spoke paths
- 4-tier fountain
- Circular ring road with cars

---

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| Three.js | 0.163 | 3D rendering |
| Vite | 5.2 | Build tool |
| GitHub REST API | v3 | Repo stats |
| localStorage | — | User persistence |

---

## 🔧 Troubleshooting

**"Repository not found"** → Make sure the repo is **public**

**"Rate limit exceeded"** → Add `VITE_GITHUB_TOKEN` to `.env` file

**Black screen** → Check browser console; ensure WebGL is supported

**Buildings not updating** → Click the **⟳ SYNC** button in the top bar to re-fetch GitHub data

**Low FPS** → Lower your browser zoom level, or close other GPU-heavy tabs
