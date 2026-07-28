'use client'
import { memo, useRef, useState, type FormEvent } from 'react'
import { LINKEDIN } from '@/lib/content'

export const Contact = memo(function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const form = formRef.current
    if (!form) return
    const fd = new FormData(form)
    setSending(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          message: fd.get('message'),
          website: fd.get('website'),
        }),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  const field =
    'w-full bg-black/30 border border-white/10 px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:border-white/40 focus:outline-none'

  return (
    <form ref={formRef} onSubmit={onSubmit} className="max-w-md space-y-2.5">
      {/* Honeypot */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">name:</label>
        <input name="name" required placeholder="your name" className={field} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">email:</label>
        <input name="email" type="email" required placeholder="you@example.com" className={field} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">message:</label>
        <textarea name="message" required rows={4} placeholder="say hello…" className={`${field} resize-none`} />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-white px-4 py-2 font-medium text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-60"
      >
        {sending ? 'transmitting…' : 'send ↵'}
      </button>
      {status === 'success' && <p className="text-emerald-400">✓ message transmitted. I&apos;ll reply soon.</p>}
      {status === 'error' && (
        <p className="text-red-400">
          transmission failed, try{' '}
          <a href={LINKEDIN} className="underline" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          .
        </p>
      )}
    </form>
  )
})
