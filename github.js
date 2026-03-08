/**
 * GitHub API utilities
 * Uses public GitHub REST API (unauthenticated: 60 req/hr).
 * To increase rate limit, set VITE_GITHUB_TOKEN in a .env file:
 *   VITE_GITHUB_TOKEN=ghp_yourPersonalAccessTokenHere
 */

const BASE = 'https://api.github.com'

function headers() {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `token ${token}` } : {}),
  }
}

/** Parse a GitHub URL into { owner, repo } */
export function parseGitHubUrl(url) {
  if (!url) return null
  const m = url.trim().match(/github\.com[/:]([^/\s]+)\/([^/\s.#?]+)/)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') }
}

/** Fetch all key repo stats and derive hackathon scores */
export async function fetchRepoData(githubUrl) {
  const parsed = parseGitHubUrl(githubUrl)
  if (!parsed) throw new Error('Invalid GitHub URL. Use: https://github.com/owner/repo')

  const { owner, repo } = parsed
  const h = headers()

  // 1) Basic repo info
  const repoRes = await fetch(`${BASE}/repos/${owner}/${repo}`, { headers: h })
  if (repoRes.status === 404) throw new Error(`Repository "${owner}/${repo}" not found or is private.`)
  if (repoRes.status === 403) throw new Error('GitHub API rate limit exceeded. Add VITE_GITHUB_TOKEN to .env file.')
  if (!repoRes.ok) throw new Error(`GitHub API error: ${repoRes.status}`)
  const repoInfo = await repoRes.json()

  // 2) Recent commits (last 100)
  const commitsRes = await fetch(`${BASE}/repos/${owner}/${repo}/commits?per_page=100`, { headers: h })
  const commitsData = commitsRes.ok ? await commitsRes.json() : []
  const recentCommits = Array.isArray(commitsData) ? commitsData.length : 0

  // 3) Contributors
  const contribRes = await fetch(`${BASE}/repos/${owner}/${repo}/contributors?per_page=30&anon=true`, { headers: h })
  const contribData = contribRes.ok ? await contribRes.json() : []
  const contributorCount = Array.isArray(contribData) ? contribData.length : 1

  // 4) Languages
  const langRes = await fetch(`${BASE}/repos/${owner}/${repo}/languages`, { headers: h })
  const languages = langRes.ok ? await langRes.json() : {}
  const langCount = Object.keys(languages).length

  // 5) Commits in last page to estimate total (via Link header)
  let totalCommits = recentCommits
  if (commitsRes.ok) {
    const link = commitsRes.headers.get('Link') || ''
    const lastPage = link.match(/page=(\d+)>; rel="last"/)
    if (lastPage) totalCommits = Math.min(parseInt(lastPage[1]) * 100, 999)
  }

  // ── Derive hackathon scores ──────────────────────────────────
  const stars     = repoInfo.stargazers_count || 0
  const forks     = repoInfo.forks_count || 0
  const issues    = repoInfo.open_issues_count || 0
  const hasDesc   = !!repoInfo.description
  const hasWiki   = repoInfo.has_wiki
  const hasPages  = repoInfo.has_pages
  const topics    = repoInfo.topics || []
  const ageMonths = repoInfo.created_at
    ? Math.max(1, (Date.now() - new Date(repoInfo.created_at)) / (1000*60*60*24*30))
    : 1
  const commitFreq = Math.min(totalCommits / ageMonths, 100)

  const quality    = clamp(45 + stars * 3 + (hasDesc ? 12 : 0) + Math.min(forks * 2, 15) - Math.min(issues, 10), 20, 98)
  const docs       = clamp(35 + (hasDesc ? 20 : 0) + (hasWiki ? 15 : 0) + (hasPages ? 15 : 0) + topics.length * 3, 20, 96)
  const testing    = clamp(40 + Math.min(commitFreq * 0.5, 25) + (langCount > 2 ? 10 : 0) + forks * 2, 20, 94)
  const collab     = clamp(40 + contributorCount * 10 + Math.min(forks * 3, 20) + (issues > 0 ? 8 : 0), 20, 96)
  const innovation = clamp(45 + langCount * 7 + topics.length * 4 + Math.min(stars * 2, 20), 20, 98)

  return {
    // Display data
    repoFullName:  repoInfo.full_name,
    description:   repoInfo.description || 'No description provided',
    language:      repoInfo.language || 'Unknown',
    languages:     Object.keys(languages).slice(0, 5),
    stars,
    forks,
    openIssues:    issues,
    topics,
    createdAt:     repoInfo.created_at,
    updatedAt:     repoInfo.updated_at,
    repoUrl:       repoInfo.html_url,
    homepage:      repoInfo.homepage || null,
    // Hackathon metrics
    commits:       Math.max(totalCommits, 5),
    members:       Math.min(Math.max(contributorCount, 1), 8),
    quality,
    docs,
    testing,
    collab,
    innovation,
  }
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, Math.round(v))) }
