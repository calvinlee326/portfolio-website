import { Redis } from '@upstash/redis'
import { randomUUID } from 'crypto'

export function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

/**
 * Redis-backed sliding-window rate limiter. Returns true if the request is
 * allowed. Fails open: an unconfigured or unreachable Redis must not take the
 * site down, so callers still get `true`.
 */
export async function rateLimit(key: string, limit: number, windowSecs: number): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return true

  const now = Date.now()
  try {
    const pipe = redis.pipeline()
    pipe.zremrangebyscore(key, 0, now - windowSecs * 1000)
    pipe.zadd(key, { score: now, member: `${now}:${randomUUID()}` })
    pipe.zcard(key)
    pipe.expire(key, windowSecs)
    const results = await pipe.exec()
    return (results[2] as number) <= limit
  } catch (e) {
    console.error('[rateLimit] check failed:', e)
    return true
  }
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
}
