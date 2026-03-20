import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

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
export async function POST() {
  const redis = getRedis()
  if (!redis) return NextResponse.json({ count: null })

  try {
    const count = await redis.incr('portfolio:views')
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: null })
  }
}
