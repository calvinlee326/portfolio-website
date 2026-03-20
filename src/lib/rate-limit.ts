// NOTE: This in-memory rate limiter is no longer used for the contact API.
// The contact route uses Redis-based rate limiting via Upstash (see src/app/api/contact/route.ts).
// This file is kept for reference only.

// Simple in-memory rate limiter.
// Works per-instance; on serverless (Vercel) each warm instance tracks independently,
// which is still meaningful protection against bursts from the same IP.
const store = new Map<string, number[]>()

/**
 * Returns true if the request is allowed, false if it should be blocked.
 * @param id      - identifier to rate-limit by (e.g. IP address)
 * @param limit   - max requests allowed in the window
 * @param windowMs - sliding window in milliseconds
 */
export function rateLimit(id: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const timestamps = (store.get(id) ?? []).filter((t) => now - t < windowMs)
  if (timestamps.length >= limit) return false
  timestamps.push(now)
  store.set(id, timestamps)
  return true
}
