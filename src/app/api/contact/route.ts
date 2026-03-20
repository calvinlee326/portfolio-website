import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Redis } from '@upstash/redis'

function stripHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

const ContactSchema = z.object({
  name: z.string().min(1).max(200).transform(stripHtml),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000).transform(stripHtml),
  // Honeypot — must be empty; bots fill it in automatically
  website: z.string().max(0, 'Bot detected').optional(),
})

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

/**
 * Redis-based sliding-window rate limiter.
 * Returns true if the request is allowed, false if it should be blocked.
 */
async function rateLimit(ip: string, limit = 5, windowSecs = 60): Promise<boolean> {
  const redis = getRedis()
  if (!redis) {
    // If Redis is unavailable, fall back to allowing the request
    return true
  }
  const key = `portfolio:contact:rl:${ip}`
  const now = Date.now()
  const windowMs = windowSecs * 1000

  const pipe = redis.pipeline()
  pipe.zremrangebyscore(key, 0, now - windowMs)
  pipe.zadd(key, { score: now, member: `${now}` })
  pipe.zcard(key)
  pipe.expire(key, windowSecs)
  const results = await pipe.exec()
  const count = results[2] as number
  return count <= limit
}

export async function POST(req: Request) {
  // Rate limit: 5 submissions per IP per minute
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  try {
    const allowed = await rateLimit(ip, 5, 60)
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }
  } catch (e) {
    console.error('[contact] Rate limit check failed:', e)
    // Allow through if rate limiting itself fails
  }

  try {
    const json = await req.json()
    const parsed = ContactSchema.safeParse(json)

    if (!parsed.success) {
      // Return generic error — don't reveal honeypot logic
      return NextResponse.json(
        { ok: false, error: 'Invalid request.' },
        { status: 400 }
      )
    }

    const { name, email, message, website } = parsed.data

    // Honeypot check — silently reject bots (return 200 to not tip them off)
    if (website) {
      return NextResponse.json({ ok: true })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'chunchenglee@outlook.com'
    const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'portfolio@chuncheng.dev'

    if (!RESEND_API_KEY) {
      console.error('[contact] RESEND_API_KEY is not configured')
      return NextResponse.json({ ok: false, error: 'Service unavailable. Please try again later.' }, { status: 500 })
    }

    const payload = {
      from: `Portfolio Contact <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: `Portfolio contact from ${name}`,
      reply_to: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const errText = await r.text()
      console.error('[contact] Resend API error:', errText)
      return NextResponse.json({ ok: false, error: 'Failed to send message. Please try again later.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[contact] Unexpected error:', e)
    return NextResponse.json({ ok: false, error: 'Unexpected error. Please try again later.' }, { status: 500 })
  }
}
