import { NextResponse } from 'next/server'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { name, email, message } = ContactSchema.parse(json)

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
        'Authorization': `Bearer ${RESEND_API_KEY}`,
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
    if (e?.name === 'ZodError') {
      return NextResponse.json({ ok: false, error: e.errors }, { status: 400 })
    }
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 })
  }
}


