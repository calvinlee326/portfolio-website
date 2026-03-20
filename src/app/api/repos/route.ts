import { NextResponse } from 'next/server'

const GITHUB_USER = 'calvinlee326'

// Cache this response for 1 hour — avoids GitHub rate limits and speeds up page load
export const revalidate = 3600

export async function GET() {
  try {
    const r = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=updated&type=owner`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      }
    )

    if (!r.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: 502 })
    }

    const repos = await r.json()
    const filtered = (repos as any[])
      .filter((x) => !x.fork)
      .slice(0, 9)
      .map(({ id, name, description, html_url, stargazers_count, forks_count, language, pushed_at }) => ({
        id, name, description, html_url, stargazers_count, forks_count, language, pushed_at,
      }))

    return NextResponse.json(filtered, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
