'use client'
import { memo, useEffect, useState } from 'react'

type SpotifyData =
  | { isPlaying: false }
  | { isPlaying: true; title: string; artist: string; albumArt?: string; songUrl: string }

export const StatusBar = memo(function StatusBar() {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null)
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    async function loadSpotify() {
      try {
        const res = await fetch('/api/spotify', { cache: 'no-store' })
        if (res.ok && active) setSpotify(await res.json())
      } catch {
        /* ignore */
      }
    }

    async function trackViews() {
      try {
        const method = sessionStorage.getItem('viewed') ? 'GET' : 'POST'
        if (method === 'POST') sessionStorage.setItem('viewed', '1')
        const res = await fetch('/api/views', { method })
        const d = await res.json()
        if (active && d.count !== null) setViews(d.count)
      } catch {
        /* ignore */
      }
    }

    loadSpotify()
    trackViews()
    const id = setInterval(loadSpotify, 60_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
      <span className="truncate">
        {spotify?.isPlaying ? (
          <a href={spotify.songUrl} target="_blank" rel="noreferrer" className="text-emerald-400/90 hover:underline">
            ♪ {spotify.title} — {spotify.artist}
          </a>
        ) : (
          <span>♪ not playing</span>
        )}
      </span>
      <span className="shrink-0">{views !== null ? `visitors: ${views.toLocaleString()}` : ''}</span>
    </div>
  )
})
