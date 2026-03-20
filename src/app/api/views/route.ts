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

// GET — increment visitor count and return the new total
export async function GET() {
  const redis = getRedis()
  if (!redis) {
    // Gracefully return null when Redis is not configured
    return NextResponse.json({ count: null })
  }

  try {
    const count = await redis.incr('portfolio:views')
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: null })
  }
}
