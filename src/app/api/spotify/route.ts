import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token as string
}

export async function GET() {
  const token = await getAccessToken()
  if (!token) return NextResponse.json({ isPlaying: false })

  try {
    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // 204 = nothing playing, 200 = playing
    if (res.status === 204 || !res.ok) {
      return NextResponse.json({ isPlaying: false })
    }

    const data = await res.json()

    if (!data?.is_playing || data?.currently_playing_type !== 'track') {
      return NextResponse.json({ isPlaying: false })
    }

    return NextResponse.json({
      isPlaying: true,
      title: data.item.name as string,
      artist: (data.item.artists as { name: string }[]).map((a) => a.name).join(', '),
      albumArt: (data.item.album.images[2] ?? data.item.album.images[0])?.url as string | undefined,
      songUrl: data.item.external_urls.spotify as string,
    })
  } catch {
    return NextResponse.json({ isPlaying: false })
  }
}
