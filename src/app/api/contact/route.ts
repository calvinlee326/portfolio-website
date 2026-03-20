import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

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

export async function POST(req: Request) {
  // Rate limit: 5 submissions per IP per minute
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    )
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
      return NextResponse.json({ ok: false, error: 'Missing RESEND_API_KEY' }, { status: 500 })
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
      const err = await r.text()
      return NextResponse.json({ ok: false, error: err }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 })
  }
}
