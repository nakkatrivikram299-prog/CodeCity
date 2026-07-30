"""
GitHub API integration service with mock data fallback generator.
"""
from datetime import datetime, timedelta
import random
import httpx
from typing import List, Dict, Any, Optional

from app.config import settings

LANGUAGE_DISTRICT_MAP = {
    "Python": "ai",
    "Jupyter Notebook": "ai",
    "R": "ai",
    "Julia": "ai",
    "C++": "backend",
    "Rust": "backend",
    "Go": "backend",
    "Java": "backend",
    "C#": "backend",
    "Elixir": "backend",
    "JavaScript": "frontend",
    "TypeScript": "frontend",
    "HTML": "frontend",
    "CSS": "frontend",
    "Vue": "frontend",
    "Svelte": "frontend",
    "Solidity": "blockchain",
    "Move": "blockchain",
    "Shell": "security",
    "C": "security",
    "Assembly": "security",
    "Dockerfile": "tools",
    "HCL": "tools",
    "Makefile": "tools",
}


def determine_district(language: Optional[str], topics: List[str]) -> str:
    topics_str = " ".join(topics).lower()
    if any(k in topics_str for k in ["ai", "ml", "machine-learning", "deep-learning", "llm", "neural", "pytorch", "tensorflow"]):
        return "ai"
    if any(k in topics_str for k in ["web3", "crypto", "blockchain", "ethereum", "solidity"]):
        return "blockchain"
    if any(k in topics_str for k in ["security", "cyber", "hack", "penetration", "auth"]):
        return "security"
    if any(k in topics_str for k in ["devops", "cli", "tool", "docker", "kubernetes", "infra"]):
        return "tools"

    if language in LANGUAGE_DISTRICT_MAP:
        return LANGUAGE_DISTRICT_MAP[language]
    return "frontend"


def generate_mock_repositories(username: str) -> List[Dict[str, Any]]:
    """Generates rich, procedural 3D skyscraper repository data for guest / fallback mode."""
    random.seed(username)
    
    preset_repos = [
        {"name": "cyber-mesh-engine", "lang": "Rust", "district": "backend", "stars": 1420, "forks": 184, "size": 18400, "desc": "High-performance distributed 3D spatial rendering engine."},
        {"name": "neural-skyline-v2", "lang": "Python", "district": "ai", "stars": 3890, "forks": 412, "size": 42100, "desc": "Autonomous deep neural architecture for generative cityscape synthesis."},
        {"name": "quantum-wallet-core", "lang": "Solidity", "district": "blockchain", "stars": 890, "forks": 95, "size": 6500, "desc": "Zero-knowledge cryptographic security suite for decentralized consensus."},
        {"name": "matrix-ui-system", "lang": "TypeScript", "district": "frontend", "stars": 2450, "forks": 310, "size": 14200, "desc": "Glassmorphism React component library with WebGL shader acceleration."},
        {"name": "zero-trust-proxy", "lang": "Go", "district": "security", "stars": 1120, "forks": 140, "size": 9800, "desc": "Ultra-low latency microservice security gateway with eBPF filtering."},
        {"name": "hyper-cluster-cli", "lang": "Shell", "district": "tools", "stars": 640, "forks": 78, "size": 3200, "desc": "Automated cloud orchestration CLI tool for edge deployments."},
        {"name": "sentinel-ai-agent", "lang": "Python", "district": "ai", "stars": 5120, "forks": 670, "size": 38900, "desc": "Multi-agent autonomous coding assistant with real-time feedback loops."},
        {"name": "hologram-canvas-3d", "lang": "JavaScript", "district": "frontend", "stars": 1780, "forks": 220, "size": 11500, "desc": "Three.js lighting shaders and volumetric particle simulation playground."},
        {"name": "orbit-db-cache", "lang": "C++", "district": "backend", "stars": 2100, "forks": 290, "size": 27400, "desc": "In-memory columnar caching store optimized for AVX-512 SIMD vectorization."},
        {"name": "glitch-auth-vault", "lang": "TypeScript", "district": "security", "stars": 930, "forks": 105, "size": 8400, "desc": "Biometric OAuth2 + WebAuthn authentication protocol handler."},
        {"name": "vapor-design-tokens", "lang": "CSS", "district": "frontend", "stars": 510, "forks": 42, "size": 2100, "desc": "Cyberpunk color themes and dynamic typography variables."},
        {"name": "chronos-pipeline", "lang": "Dockerfile", "district": "tools", "stars": 430, "forks": 61, "size": 4900, "desc": "Containerized CI/CD build matrix executor for multi-arch targets."}
    ]

    repos = []
    for idx, item in enumerate(preset_repos):
        repo_id = idx + 1000
        created = datetime.utcnow() - timedelta(days=random.randint(30, 730))
        updated = datetime.utcnow() - timedelta(hours=random.randint(1, 48))
        
        # Generate 6 realistic commits for each repo
        commits = []
        messages = [
            "feat: implement volumetric neon shaders and lighting bloom",
            "fix: optimize BVH spatial indexing for high poly buildings",
            "refactor: migrate state store to reactive signal streams",
            "docs: update API spec and architecture diagrams",
            "perf: reduce draw calls with instanced mesh rendering",
            "feat: add real-time WebSocket commit listener",
        ]
        for c_idx in range(6):
            c_time = updated - timedelta(days=c_idx * random.randint(1, 5), hours=random.randint(0, 12))
            commits.append({
                "id": f"commit-{repo_id}-{c_idx}",
                "sha": f"c{random.randint(1000000, 9999999):x}",
                "message": messages[c_idx % len(messages)],
                "authorName": username,
                "authorEmail": f"{username}@users.noreply.github.com",
                "committedAt": c_time,
                "additions": random.randint(10, 350),
                "deletions": random.randint(2, 120),
            })

        repos.append({
            "id": f"repo-mock-{repo_id}",
            "githubId": repo_id,
            "name": item["name"],
            "fullName": f"{username}/{item['name']}",
            "description": item["desc"],
            "language": item["lang"],
            "starsCount": item["stars"],
            "forksCount": item["forks"],
            "openIssuesCount": random.randint(0, 15),
            "size": item["size"],
            "defaultBranch": "main",
            "district": item["district"],
            "isPrivate": False,
            "topics": [item["district"], item["lang"].lower(), "codecity", "futuristic"],
            "createdAt": created,
            "updatedAt": updated,
            "recentCommits": commits,
        })
    return repos


async def fetch_github_user_repos(github_username: str, token: Optional[str] = None) -> List[Dict[str, Any]]:
    """Fetches user repositories from GitHub API or returns mock repos on failure/rate-limit."""
    if not github_username or github_username.startswith("demo_") or github_username == "guest":
        return generate_mock_repositories(github_username or "cyber_architect")

    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    url = f"{settings.GITHUB_API_BASE_URL}/users/{github_username}/repos?per_page=100&sort=updated"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return generate_mock_repositories(github_username)

            data = resp.json()
            if not isinstance(data, list):
                return generate_mock_repositories(github_username)

            result = []
            for item in data:
                lang = item.get("language") or "JavaScript"
                topics = item.get("topics") or []
                district = determine_district(lang, topics)
                
                # Mock recent commits for live repos
                commits = [
                    {
                        "id": f"commit-{item['id']}-1",
                        "sha": f"a{random.randint(100000, 999999)}",
                        "message": f"Update {item['name']} source and documentation",
                        "authorName": github_username,
                        "authorEmail": f"{github_username}@users.noreply.github.com",
                        "committedAt": datetime.utcnow() - timedelta(hours=random.randint(2, 24)),
                        "additions": random.randint(15, 120),
                        "deletions": random.randint(1, 40),
                    }
                ]

                result.append({
                    "id": f"repo-gh-{item['id']}",
                    "githubId": item["id"],
                    "name": item["name"],
                    "fullName": item["full_name"],
                    "description": item.get("description") or f"A {lang} repository created by {github_username}",
                    "language": lang,
                    "starsCount": item.get("stargazers_count", 0),
                    "forksCount": item.get("forks_count", 0),
                    "openIssuesCount": item.get("open_issues_count", 0),
                    "size": item.get("size", 100),
                    "defaultBranch": item.get("default_branch", "main"),
                    "district": district,
                    "isPrivate": item.get("private", False),
                    "topics": topics,
                    "createdAt": datetime.strptime(item["created_at"], "%Y-%m-%dT%H:%M:%SZ") if "created_at" in item else datetime.utcnow(),
                    "updatedAt": datetime.strptime(item["updated_at"], "%Y-%m-%dT%H:%M:%SZ") if "updated_at" in item else datetime.utcnow(),
                    "recentCommits": commits,
                })

            return result if result else generate_mock_repositories(github_username)

    except Exception:
        return generate_mock_repositories(github_username)
