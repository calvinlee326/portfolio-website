import { NextResponse } from 'next/server'
import { clientIp, getRedis, rateLimit } from '@/lib/redis'

export const dynamic = 'force-dynamic'

// GET — read current count without incrementing
export async function GET() {
  const redis = getRedis()
  if (!redis) return NextResponse.json({ count: null })

  try {
    const count = await redis.get<number>('portfolio:views') ?? 0
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: null })
  }
}

// POST — increment count (called once per session from the client)
export async function POST(req: Request) {
  const redis = getRedis()
  if (!redis) return NextResponse.json({ count: null })

  // The once-per-session guard lives in sessionStorage, which is client-side
  // and therefore not a control: cap the increment per IP so the counter
  // cannot be inflated by hand.
  const allowed = await rateLimit(`portfolio:views:rl:${clientIp(req)}`, 10, 60)
  if (!allowed) return GET()

  try {
    const count = await redis.incr('portfolio:views')
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: null })
  }
}
