'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCommandPalette } from '@/components/CommandPaletteContext'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import {
  NAME, LOCATION, LANGUAGES, LINKEDIN, GITHUB_USER, RESUME_URL, EMAIL,
  SKILLS, REPO_DESCRIPTIONS, LIVE_DEMOS, SHOWCASE, RESUME_SUMMARY,
  toDrivePreview, type GitHubRepo,
} from '@/lib/content'

const CONTAINER = 'mx-auto max-w-[1400px] px-6 lg:px-10'

// Accent discipline: green means "live / verifiable" (demos, now-playing,
// availability, sent confirmation) and is used for nothing else.
const ACCENT_TEXT = 'text-emerald-700'

// MotionConfig reducedMotion="user" (page root) strips the transform under
// prefers-reduced-motion; keeping `initial` constant avoids hydration drift.
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{children}</h2>
}

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-neutral-900">
        <SiteNav />
        <main>
          <Hero />
          <Showcase />
          <StatBand />
          <Skills />
          <Projects />
          <Resume />
          <Contact />
          <Footer />
        </main>
      </div>
    </MotionConfig>
  )
}

// ── NAV ─────────────────────────────────────────────────────────────────────
function SiteNav() {
  const [open, setOpen] = useState(false)
  const { setOpen: openPalette } = useCommandPalette()
  const links = [
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#resume', label: 'Resume' },
    { href: '#contact', label: 'Contact' },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className={`${CONTAINER} flex h-16 items-center justify-between`}>
        <a href="#top" className="text-base font-semibold tracking-tight">{NAME}</a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline underline-offset-4 transition-colors"
          >
            3D terminal
          </Link>
          <button
            onClick={() => openPalette(true)}
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Open command palette"
          >
            <kbd className="font-sans">⌘K</kbd>
          </button>
        </nav>
        <button
          className="md:hidden p-2 text-neutral-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-neutral-200 bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-neutral-600 hover:text-neutral-900"
                >
                  {l.label}
                </a>
              ))}
              <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
                3D terminal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ── HERO ────────────────────────────────────────────────────────────────────
// Hard split: white sheet left, near-black panel right. The first headline
// line straddles the seam via mix-blend-difference; a ghost repeat of the
// surname sits inside the panel behind it as a depth cue.
function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[42%] bg-neutral-950 lg:block">
        <span className="absolute top-[16%] -right-8 select-none text-[11rem] font-bold leading-none tracking-tighter text-white/[0.05]">
          LEE
        </span>
        <div className="absolute bottom-12 left-10 right-10 space-y-3">
          <OpenToWork onDark />
          <SpotifyWidget onDark />
        </div>
      </div>

      <div className={`${CONTAINER} relative flex min-h-[88dvh] flex-col justify-center py-24`}>
        <FadeIn>
          <h1 className="text-[clamp(3.25rem,10vw,9rem)] font-bold leading-[0.95] tracking-tighter lg:mix-blend-difference lg:text-white">
            Chun-Cheng
            <br />
            Lee.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10 max-w-xl lg:max-w-[48%]">
          <p className="text-lg text-neutral-600 leading-relaxed">
            Backend-focused software engineer. APIs, AI integrations, and payment
            systems you can click into and verify.
          </p>
          <p className="mt-3 text-sm text-neutral-400">{LOCATION}</p>
        </FadeIn>
        <FadeIn delay={0.18} className="mt-10 flex flex-wrap items-center gap-6 lg:max-w-[48%]">
          <a
            href="#projects"
            className="inline-flex h-12 items-center bg-neutral-900 px-7 text-sm font-medium text-white transition hover:bg-neutral-700 active:translate-y-px"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
          >
            Get in touch
          </a>
        </FadeIn>
        <div className="mt-12 space-y-2 lg:hidden">
          <OpenToWork />
          <SpotifyWidget />
        </div>
      </div>
    </section>
  )
}

function OpenToWork({ onDark = false }: { onDark?: boolean }) {
  return (
    <p className={`flex items-center gap-2.5 text-sm ${onDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Open to backend and full-stack roles
    </p>
  )
}

// ── SPOTIFY ──────────────────────────────────────────────────────────────────
type SpotifyData = { isPlaying: false } | { isPlaying: true; title: string; artist: string; albumArt?: string; songUrl: string }

function SpotifyWidget({ onDark = false }: { onDark?: boolean }) {
  const [data, setData] = useState<SpotifyData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/spotify', { cache: 'no-store' })
        if (res.ok) setData(await res.json())
      } catch { /* ignore */ }
    }

    load()
    let intervalId = setInterval(load, 60_000)

    function handleVisibilityChange() {
      if (document.hidden) {
        clearInterval(intervalId)
      } else {
        load()
        intervalId = setInterval(load, 60_000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (!data?.isPlaying) return null

  return (
    <p className="text-sm">
      <span className={onDark ? 'text-neutral-500' : 'text-neutral-400'}>Now playing: </span>
      <a
        href={data.songUrl}
        target="_blank"
        rel="noreferrer"
        className={`underline underline-offset-4 ${onDark ? 'text-emerald-400' : ACCENT_TEXT}`}
      >
        {data.title}, {data.artist}
      </a>
    </p>
  )
}

// ── SHOWCASE ─────────────────────────────────────────────────────────────────
function Showcase() {
  return (
    <section aria-label="What I build" className="bg-neutral-50 py-24 sm:py-32">
      <div className={CONTAINER}>
        <FadeIn>
          <SectionTitle>What I build.</SectionTitle>
        </FadeIn>
        <div className="mt-14 divide-y divide-neutral-200 border-t border-neutral-200">
          {SHOWCASE.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.06}>
              <div className="grid gap-3 py-10 md:grid-cols-12 md:gap-8">
                <h3 className="text-2xl font-semibold tracking-tight md:col-span-4">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed md:col-span-5">{item.desc}</p>
                <p className="text-sm text-neutral-400 md:col-span-3 md:text-right">{item.tags.join(', ')}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── STAT BAND ────────────────────────────────────────────────────────────────
// The one deliberate inversion on the page. Numbers are derived from the
// content model, not invented.
function StatBand() {
  const stats = [
    { value: Object.keys(REPO_DESCRIPTIONS).length, label: 'Projects documented' },
    { value: Object.keys(LIVE_DEMOS).length, label: 'Live demos running' },
    { value: LANGUAGES.length, label: 'Languages spoken' },
  ]
  return (
    <section className="bg-neutral-950 py-20 text-white">
      <div className={`${CONTAINER} grid gap-10 sm:grid-cols-3`}>
        {stats.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.06}>
            <div className="border-l border-white/15 pl-6">
              <p className="text-6xl sm:text-7xl font-bold tracking-tight tabular-nums">{s.value}</p>
              <p className="mt-3 text-sm text-neutral-400">{s.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ── SKILLS ───────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 bg-white py-24 sm:py-32">
      <div className={CONTAINER}>
        <FadeIn>
          <SectionTitle>Skills.</SectionTitle>
        </FadeIn>
        <dl className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SKILLS).map(([category, items], i) => (
            <FadeIn key={category} delay={Math.min(i * 0.04, 0.2)}>
              <dt className="text-sm font-semibold">{category}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-600">{items.join(', ')}</dd>
            </FadeIn>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 overflow-hidden bg-neutral-100 py-24 sm:py-32">
      <div className={CONTAINER}>
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionTitle>Real work.</SectionTitle>
              <p className="mt-3 text-neutral-500">Pulled live from GitHub.</p>
            </div>
            <a
              className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer"
            >
              All repositories
            </a>
          </div>
        </FadeIn>
      </div>
      <ProjectRail />
    </section>
  )
}

// Horizontal rail, deliberately clipped at the viewport edge to show
// continuation. Tiles separate from the band by value, not by borders.
const RAIL_PAD = 'px-[max(1.5rem,calc((100vw-87.5rem)/2+2.5rem))]'

function ProjectRail() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/repos')
        if (!r.ok) throw new Error('GitHub API error')
        const all = await r.json()
        setRepos(Array.isArray(all) ? all : [])
      } catch {
        setErr('Could not load GitHub repos.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className={`mt-14 flex gap-6 overflow-hidden ${RAIL_PAD}`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 w-[85vw] max-w-[420px] shrink-0 animate-pulse bg-neutral-200" />
        ))}
      </div>
    )
  }
  if (err) {
    return (
      <p className={`mt-14 text-sm text-neutral-600 ${RAIL_PAD}`}>
        {err}{' '}
        <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          Browse them on GitHub instead
        </a>
        .
      </p>
    )
  }
  if (repos.length === 0) {
    return <p className={`mt-14 text-sm text-neutral-500 ${RAIL_PAD}`}>No GitHub projects available right now.</p>
  }

  return (
    <div className="mt-14 overflow-x-auto">
      <div className={`flex w-max snap-x snap-mandatory gap-6 pb-4 ${RAIL_PAD}`}>
        {repos.map((r) => (
          <article key={r.id} className="flex w-[85vw] max-w-[420px] shrink-0 snap-start flex-col bg-white p-8">
            <h3 className="text-xl font-semibold tracking-tight">{r.name}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
              {REPO_DESCRIPTIONS[r.name] || r.description || 'No description provided.'}
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-neutral-400 tabular-nums">
              <span>{r.language ?? ''}</span>
              <span>{new Date(r.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="mt-5 flex items-center gap-6 border-t border-neutral-100 pt-5 text-sm font-medium">
              {LIVE_DEMOS[r.name] && (
                <a
                  href={LIVE_DEMOS[r.name]}
                  target="_blank"
                  rel="noreferrer"
                  className={`${ACCENT_TEXT} underline underline-offset-4`}
                >
                  Live demo
                </a>
              )}
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
              >
                Code
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

// ── RESUME ───────────────────────────────────────────────────────────────────
function Resume() {
  const preview = toDrivePreview(RESUME_URL)
  return (
    <section id="resume" className="scroll-mt-16 bg-white py-24 sm:py-32">
      <div className={CONTAINER}>
        <FadeIn>
          <SectionTitle>Resume.</SectionTitle>
        </FadeIn>
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="aspect-[3/4] w-full overflow-hidden ring-1 ring-neutral-200">
              <iframe src={preview} title="Resume Preview" className="h-full w-full" allow="autoplay" />
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="flex h-full flex-col">
              <div className="flex-1 divide-y divide-neutral-200">
                {RESUME_SUMMARY.map((item) => (
                  <div key={item.label} className="py-6 first:pt-0">
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center bg-neutral-900 px-7 text-sm font-medium text-white transition hover:bg-neutral-700 active:translate-y-px"
                >
                  Open resume
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
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
        body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), message: fd.get('message'), website: fd.get('website') }),
      })
      if (res.ok) { setStatus('success'); formRef.current?.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
    finally { setSending(false) }
  }

  const inputClass =
    'w-full rounded-none border-0 border-b border-neutral-300 bg-transparent px-0 py-2.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-0'

  return (
    <section id="contact" className="scroll-mt-16 bg-neutral-50 py-24 sm:py-32">
      <div className={CONTAINER}>
        <FadeIn>
          <SectionTitle>Contact.</SectionTitle>
        </FadeIn>
        <div className="mt-14 grid gap-16 lg:grid-cols-2">
          <FadeIn>
            <form ref={formRef} onSubmit={onSubmit} className="space-y-8">
              {/* Honeypot: hidden from real users, bots fill it in */}
              <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">Name</label>
                <input id="contact-name" name="name" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">Email</label>
                <input id="contact-email" name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">Message</label>
                <textarea id="contact-message" name="message" rows={5} required className={`${inputClass} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-12 items-center bg-neutral-900 px-7 text-sm font-medium text-white transition hover:bg-neutral-700 active:translate-y-px disabled:opacity-60"
              >
                {sending ? 'Sending' : 'Send message'}
              </button>
              <AnimatePresence>
                {status === 'success' && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`text-sm ${ACCENT_TEXT}`}>
                    Message sent. I will get back to you soon.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-600">
                    Something went wrong. Try{' '}
                    <a href={LINKEDIN} target="_blank" rel="noreferrer" className="underline underline-offset-4">LinkedIn</a> instead.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="divide-y divide-neutral-200 border-t border-neutral-200 lg:border-t-0 lg:pt-0">
              {[
                { href: `https://github.com/${GITHUB_USER}`, label: 'GitHub', value: `github.com/${GITHUB_USER}` },
                { href: LINKEDIN, label: 'LinkedIn', value: 'linkedin.com/in/chunchenglee326' },
                { href: `mailto:${EMAIL}`, label: 'Email', value: EMAIL },
              ].map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="group flex items-baseline justify-between gap-4 py-5">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-neutral-600 underline-offset-4 group-hover:underline">{item.value}</span>
                </a>
              ))}
              <p className="flex items-baseline justify-between gap-4 py-5 text-sm">
                <span className="font-medium">Based in</span>
                <span className="text-neutral-600">{LOCATION} · {LANGUAGES.join(', ')}</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const [views, setViews] = useState<number | null>(null)
  const { setOpen: openPalette } = useCommandPalette()

  useEffect(() => {
    async function track() {
      try {
        // Only increment once per browser session
        if (!sessionStorage.getItem('viewed')) {
          sessionStorage.setItem('viewed', '1')
          const r = await fetch('/api/views', { method: 'POST' })
          const d = await r.json()
          if (d.count !== null) setViews(d.count)
        } else {
          const r = await fetch('/api/views')
          const d = await r.json()
          if (d.count !== null) setViews(d.count)
        }
      } catch {}
    }
    track()
  }, [])

  return (
    <footer className="border-t border-neutral-200 bg-white py-10">
      <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500`}>
        <p>© {new Date().getFullYear()} {NAME}</p>
        <div className="flex items-center gap-6">
          {views !== null && <span className="tabular-nums">{views.toLocaleString()} visits</span>}
          <button onClick={() => openPalette(true)} className="hover:text-neutral-900 transition-colors">
            Press <kbd className="font-sans">⌘K</kbd> to navigate
          </button>
          <Link href="/" className="underline underline-offset-4 hover:text-neutral-900">3D terminal</Link>
        </div>
      </div>
    </footer>
  )
}
