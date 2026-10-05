import { NextResponse } from 'next/server'
import { GITHUB_USER, type GitHubRepo } from '@/lib/content'

interface GitHubEvent {
  type: string
  created_at: string
  repo: { name: string }
}

// GitHub stores the Website field as free text; only absolute http(s) URLs become links.
const WEB_URL = /^https?:\/\//

// Cache this response for 1 hour — avoids GitHub rate limits and speeds up page load
export const revalidate = 3600

function github(path: string) {
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate: 3600 },
  })
}

export async function GET() {
  try {
    const [r, e] = await Promise.all([
      github(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner`),
      github(`/users/${GITHUB_USER}/events/public?per_page=100`),
    ])

    if (!r.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: 502 })
    }

    const repos: (GitHubRepo & { fork: boolean })[] = await r.json()
    // Ranking only; without events the order falls back to pushed_at.
    const events: GitHubEvent[] = e.ok ? await e.json() : []

    // pushed_at also moves on bot commits (h1b-job-scraper's Action pushes
    // daily), so rank by the owner's own latest push. The events feed only
    // reaches back a few weeks: a repo with no own push in it can't have had
    // one since the feed's oldest event, so it is capped there.
    // ponytail: one events page; a repo whose last own push predates the feed
    // still ranks by pushed_at, which bot commits can inflate.
    const ownPush = new Map<string, string>()
    for (const ev of events) {
      if (ev.type === 'PushEvent' && ev.created_at > (ownPush.get(ev.repo.name) ?? '')) {
        ownPush.set(ev.repo.name, ev.created_at)
      }
    }
    const feedStart = events.map((ev) => ev.created_at).sort()[0] ?? ''
    const rank = (x: GitHubRepo) =>
      ownPush.get(`${GITHUB_USER}/${x.name}`) ?? (x.pushed_at < feedStart ? x.pushed_at : feedStart)

    const filtered = repos
      // The repo named after the account is the profile README, not a project.
      .filter((x) => !x.fork && x.name !== GITHUB_USER)
      .sort((a, b) => rank(b).localeCompare(rank(a)) || b.pushed_at.localeCompare(a.pushed_at))
      .map(({ id, name, description, html_url, stargazers_count, forks_count, language, pushed_at, homepage }): GitHubRepo => ({
        id, name, description, html_url, stargazers_count, forks_count, language, pushed_at, homepage: homepage && WEB_URL.test(homepage) ? homepage : null,
      }))

    return NextResponse.json(filtered, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
