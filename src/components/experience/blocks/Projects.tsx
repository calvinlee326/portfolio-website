'use client'
import { memo, useEffect, useState } from 'react'
import { type GitHubRepo, GITHUB_USER, LANG_COLORS, REPO_DESCRIPTIONS, LIVE_DEMOS } from '@/lib/content'

// If the GitHub API is unreachable, the page's core content must not collapse
// into an error line — fall back to the curated repos we already describe.
const FALLBACK_REPOS: GitHubRepo[] = Object.entries(REPO_DESCRIPTIONS).map(([name, description]) => ({
  id: Array.from(name).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7),
  name,
  description,
  html_url: `https://github.com/${GITHUB_USER}/${name}`,
  stargazers_count: 0,
  forks_count: 0,
  language: null,
  pushed_at: '',
}))

export const Projects = memo(function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading')

  useEffect(() => {
    let active = true
    fetch('/api/repos')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('repos'))))
      .then((d) => {
        if (!active) return
        setRepos(Array.isArray(d) ? d : [])
        setState('ok')
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [])

  if (state === 'loading') return <div className="text-slate-500">fetching commits…</div>

  const list = state === 'error' ? FALLBACK_REPOS : repos

  return (
    <div className="space-y-2.5">
      {state === 'error' && (
        <div className="text-amber-400/90">warn: could not reach github — showing pinned repos</div>
      )}
      {list.map((r) => {
        const hash = (r.id.toString(16) + '0000000').slice(0, 7)
        return (
          <div key={r.id}>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-amber-400/90">{hash}</span>
              <a href={r.html_url} target="_blank" rel="noreferrer" className="font-medium text-sky-300 hover:underline">
                {r.name}
              </a>
              {r.language && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[r.language] || '#888' }} />
                  {r.language}
                </span>
              )}
              {r.stargazers_count > 0 && <span className="text-amber-300/90">★{r.stargazers_count}</span>}
              {LIVE_DEMOS[r.name] && (
                <a href={LIVE_DEMOS[r.name]} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  live↗
                </a>
              )}
            </div>
            <div className="pl-1 text-xs text-slate-500">
              {REPO_DESCRIPTIONS[r.name] || r.description || 'no description provided'}
            </div>
          </div>
        )
      })}
      {state === 'error' && (
        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sky-300 hover:underline"
        >
          view all on github↗
        </a>
      )}
    </div>
  )
})
