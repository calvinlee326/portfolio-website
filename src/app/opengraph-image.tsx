import { ImageResponse } from 'next/og'
import { LOCATION, NAME } from '@/lib/content'

export const alt = `${NAME}, backend-focused software engineer`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const FONT_SRC = /src: url\((.+?)\) format\('(opentype|truetype)'\)/

// Satori needs raw TTF data, so pull Geist from Google Fonts at build time.
async function geist(weight: number): Promise<ArrayBuffer> {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`)).text()
  const src = css.match(FONT_SRC)?.[1]
  if (!src) throw new Error(`Geist ${weight} not found in Google Fonts CSS`)
  return (await fetch(src)).arrayBuffer()
}

// Mirrors the hero: white sheet with the name, near-black panel on the right.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', fontFamily: 'Geist' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '58%', padding: '0 64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.05em', color: '#171717' }}>
            <span>Chun-Cheng</span>
            <span>Lee.</span>
          </div>
          <div style={{ marginTop: 44, fontSize: 30, color: '#525252' }}>Backend-focused software engineer</div>
          <div style={{ marginTop: 10, fontSize: 24, color: '#a3a3a3' }}>{LOCATION}</div>
        </div>
        <div style={{ display: 'flex', position: 'relative', width: '42%', background: '#0a0a0a', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 70, right: -40, fontSize: 260, fontWeight: 700, letterSpacing: '-0.06em', color: 'rgba(255,255,255,0.05)' }}>
            LEE
          </div>
          <div style={{ position: 'absolute', left: 48, bottom: 56, display: 'flex', alignItems: 'center', fontSize: 22, color: '#d4d4d4' }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: '#10b981', marginRight: 16 }} />
            Open to backend and full-stack roles
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Geist', data: await geist(700), weight: 700 },
        { name: 'Geist', data: await geist(400), weight: 400 },
      ],
    }
  )
}
