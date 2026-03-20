'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useCommandPalette } from '@/components/CommandPaletteContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  LucideGithub, LucideLinkedin, LucideInstagram, Mail, FileText,
  MapPin, Languages, ExternalLink, ArrowRight, Star, Code2, Loader2,
  ChevronLeft, ChevronRight, GitFork, Menu, X, Zap, Globe, Music2,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ==== CONFIG ================================================================
const NAME = 'Chun-Cheng Lee'
const LOCATION = 'Los Angeles, CA'
const LANGUAGES = ['English', 'Mandarin', 'Taiwanese']
const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
const GITHUB_USER = 'calvinlee326'
const RESUME_URL = 'https://drive.google.com/file/d/1BSBaHCnNDVzVW-mEGur0F76NA1u1KCEC/view?usp=sharing'
const EMAIL = 'chunchenglee@outlook.com'
const BIO = 'Backend-focused SWE who builds APIs, AI integrations, and payment systems. Passionate about clean architecture and shipping products that work. Open to full-time backend or full-stack roles.'

const SKILLS: Record<string, string[]> = {
  'Languages':   ['Python', 'TypeScript', 'JavaScript', 'SQL'],
  'Frameworks':  ['Django', 'FastAPI', 'Next.js', 'React'],
  'Tools':       ['PostgreSQL', 'Docker', 'Git', 'REST APIs', 'Stripe'],
  'AI / ML':     ['GPT-4o Vision', 'OpenAI API', 'Prompt Engineering', 'LangChain'],
}

const LANG_COLORS: Record<string, string> = {
  Python: '#3776ab', JavaScript: '#f7df1e', TypeScript: '#3178c6',
  HTML: '#e34f26', CSS: '#1572b6', Go: '#00add8', Rust: '#dea584',
  Java: '#b07219', Ruby: '#701516', Swift: '#fa7343', Kotlin: '#a97bff',
  Shell: '#89e051', 'C++': '#f34b7d', C: '#555555',
}

const REPO_DESCRIPTIONS: Record<string, string> = {
  'palm-reading-app': 'AI-powered palm reading web app using GPT-4o Vision. Upload a palm photo and get personality, love & fortune analysis. Built with FastAPI + Next.js.',
  'summary-extension': 'Chrome extension that summarizes selected text using GPT via a secure backend API. Right-click any text → instant AI summary.',
  'aiagent': 'Collection of AI agent workflow patterns using OpenAI GPT — structured outputs, tool calling, prompt chaining, and external API integration.',
  'component-claude': 'AI-powered React component generator (UIGen) with live preview. Describe a UI and get working React code instantly via Claude API.',
  'socket-io-demo': 'Real-time chat app built with Socket.IO featuring instant messaging, message persistence, and multi-client support.',
  'password-generator': 'Browser-based password generator with customizable length, character sets, and one-click copy. Pure HTML/CSS/JS, no dependencies.',
  'blackjack': 'Casino-style Blackjack game playable in the browser. Hit, stand, and try to reach 21 without busting.',
  'scoreboard': 'Live basketball scoreboard — track home/guest scores, add 1/2/3 points, and manually edit scores. No build step required.',
  'portfolio-website': 'This portfolio — built with Next.js, Tailwind CSS, Framer Motion, and the Resend email API.',
}

const LIVE_DEMOS: Record<string, string> = {
  'blackjack': 'https://bbblackjack.netlify.app/',
  'scoreboard': 'https://cosmic-praline-3c086a.netlify.app',
  'palm-reading-app': 'https://palm-reading-app-iota.vercel.app',
}

// Module-level constant — never changes so no need for useMemo
const ROLES = ['Software Engineer', 'Backend Developer', 'Quality Assurance', 'AI Enthusiast']

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
}

function toDrivePreview(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const fileId = parts.find((p) => p && p.length > 20)
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url
  } catch (e) {
    console.error('[toDrivePreview] Failed to parse URL:', e)
    return url
  }
}

function useTypewriter(words: string[], speed = 90, pause = 1300) {
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)
  const word = words[index % words.length]
  useEffect(() => {
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, display.length + 1))
        if (display.length + 1 === word.length) setDeleting(true)
      } else {
        setDisplay(word.slice(0, display.length - 1))
        if (display.length === 0) { setDeleting(false); setIndex((i) => (i + 1) % words.length) }
      }
    }, deleting ? speed / 1.6 : speed)
    return () => clearTimeout(t)
  }, [display, deleting, word, speed, words.length])
  useEffect(() => {
    if (!deleting && display === word) {
      const p = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(p)
    }
  }, [display, deleting, pause, word])
  return display
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Page() {
  const typed = useTypewriter(ROLES)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Hero typed={typed} />
        <Skills />
        <Projects />
        <Resume />
        <Contact />
        <Footer />
      </main>
    </div>
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
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-slate-900/75 border-b border-slate-200 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="#top" className="font-black tracking-tight text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-400 dark:to-emerald-300">Chun‑Cheng</span>
          <span className="ml-1 text-slate-700 dark:text-slate-300">Lee</span>
        </a>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          {/* Cmd+K hint */}
          <button
            onClick={() => openPalette(true)}
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Open command palette"
          >
            <kbd className="font-sans">⌘K</kbd>
          </button>
          <div className="hidden md:flex"><Socials compact /></div>
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/95 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white py-1 transition">{l.label}</a>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10"><Socials /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ── HERO ────────────────────────────────────────────────────────────────────
function Hero({ typed }: { typed: string }) {
  return (
    <section id="top" className="pt-16 pb-8 sm:pt-24 sm:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        {/* Open to work badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 text-xs font-medium"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Open to work
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 dark:from-blue-400 dark:via-cyan-300 dark:to-emerald-300">{NAME}</span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 h-8">
          <span>{typed}</span>
          <span className="ml-0.5 animate-pulse text-blue-500 dark:text-blue-400">▌</span>
        </p>

        <p className="mt-5 mx-auto max-w-xl text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">{BIO}</p>

        <div className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <MapPin className="h-3.5 w-3.5" /> {LOCATION}
          <span className="h-3 w-px bg-slate-300 dark:bg-white/20" />
          <Languages className="h-3.5 w-3.5" /> {LANGUAGES.join(' • ')}
        </div>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#contact">
            <Button className="group bg-blue-600 hover:bg-blue-500 text-white px-6">
              Contact Me <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Button>
          </a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 px-6">
              <FileText className="mr-2 h-4 w-4" /> View Resume
            </Button>
          </a>
        </div>

        <div className="mt-5 flex justify-center"><Socials /></div>

        {/* Spotify Now Playing */}
        <SpotifyWidget />
      </motion.div>
    </section>
  )
}

// ── SPOTIFY ──────────────────────────────────────────────────────────────────
type SpotifyData = { isPlaying: false } | { isPlaying: true; title: string; artist: string; albumArt?: string; songUrl: string }

function SpotifyWidget() {
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

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-4 flex justify-center"
    >
      {data.isPlaying ? (
        <a
          href={data.songUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 transition-colors group"
        >
          {data.albumArt && (
            <img src={data.albumArt} alt="" className="h-5 w-5 rounded-full" />
          )}
          <Music2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium truncate max-w-[200px]">
            {data.title} — {data.artist}
          </span>
        </a>
      ) : (
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/10 text-xs text-slate-400">
          <Music2 className="h-3.5 w-3.5" />
          Not playing
        </div>
      )}
    </motion.div>
  )
}

// ── SOCIALS ──────────────────────────────────────────────────────────────────
function Socials({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
      <a aria-label="GitHub" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-black/10 dark:hover:bg-white/10 p-2 h-9 w-9"><LucideGithub className="h-4 w-4" /></Button>
      </a>
      <a aria-label="LinkedIn" href={LINKEDIN} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-black/10 dark:hover:bg-white/10 p-2 h-9 w-9"><LucideLinkedin className="h-4 w-4" /></Button>
      </a>
      <a aria-label="Instagram" href="https://instagram.com/calvinlee326" target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-black/10 dark:hover:bg-white/10 p-2 h-9 w-9"><LucideInstagram className="h-4 w-4" /></Button>
      </a>
    </div>
  )
}

// ── SKILLS ───────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Skills</h2>
        </div>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(SKILLS).map(([category, items], ci) => (
          <FadeIn key={category} delay={ci * 0.08}>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 p-4 h-full hover:border-blue-400/50 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full text-xs bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-200 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" className="py-12">
      <FadeIn>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Code2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h2 className="text-2xl font-bold">Projects</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 ml-8">Latest from GitHub — auto-updated</p>
          </div>
          <a className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center gap-1 transition" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
            See all <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </FadeIn>
      <ProjectCarousel />
    </section>
  )
}

function ProjectCarousel() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const PER_PAGE = 3
  const totalPages = Math.ceil(repos.length / PER_PAGE)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/repos')
        const all = r.ok ? await r.json() : []
        setRepos(Array.isArray(all) ? all : [])
      } catch {
        setErr('Could not load GitHub repos.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages])
  const prev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages])

  useEffect(() => {
    if (paused || totalPages <= 1) return
    const t = setInterval(next, 3500)
    return () => clearInterval(t)
  }, [paused, next, totalPages])

  if (loading) return (
    <div className="py-16 flex items-center justify-center text-slate-400">
      <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading projects…
    </div>
  )
  if (err) return <p className="text-sm text-rose-500">{err}</p>

  const visible = repos.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r, i) => (
          <motion.div
            key={`${page}-${r.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="h-full"
          >
            <Card className="group h-full hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:bg-white/[0.07] transition-all duration-300 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="truncate flex items-center gap-2">
                    <Code2 className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors truncate">{r.name}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0 text-sm">
                    {r.stargazers_count > 0 && <span className="flex items-center text-amber-500 dark:text-amber-300/90"><Star className="h-3.5 w-3.5 mr-0.5" />{r.stargazers_count}</span>}
                    {r.forks_count > 0 && <span className="flex items-center text-slate-400"><GitFork className="h-3.5 w-3.5 mr-0.5" />{r.forks_count}</span>}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-3 flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 flex-1">{REPO_DESCRIPTIONS[r.name] || r.description || 'No description provided.'}</p>
                <div className="flex items-center justify-between">
                  {r.language ? (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: LANG_COLORS[r.language] || '#888' }} />
                      {r.language}
                    </span>
                  ) : <span />}
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(r.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  {LIVE_DEMOS[r.name] && (
                    <a href={LIVE_DEMOS[r.name]} target="_blank" rel="noreferrer" className="flex-1">
                      <Button size="sm" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white text-xs h-8">
                        <Globe className="h-3.5 w-3.5 mr-1.5" /> Live Demo
                      </Button>
                    </a>
                  )}
                  <a href={r.html_url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button size="sm" variant="secondary" className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs h-8">
                      <LucideGithub className="h-3.5 w-3.5 mr-1.5" /> Code
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'w-6 bg-blue-500' : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'}`}
              />
            ))}
          </div>
          <button onClick={next} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

// ── RESUME ───────────────────────────────────────────────────────────────────
function Resume() {
  const preview = toDrivePreview(RESUME_URL)
  return (
    <section id="resume" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Resume</h2>
        </div>
      </FadeIn>
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <FadeIn delay={0.1}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Inline Preview</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="aspect-[3/4] w-full rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10">
                <iframe src={preview} title="Resume Preview" className="w-full h-full" allow="autoplay" />
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Card className="h-full">
            <CardContent className="pt-6 flex flex-col h-full">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">Summary</p>
              <div className="space-y-4 flex-1">
                {[
                  { label: 'Backend Engineering', desc: 'Python (Django, FastAPI), PostgreSQL, REST APIs, cloud deployments on AWS & Fly.io.' },
                  { label: 'AI Integration', desc: 'GPT-4o Vision multimodal apps, prompt engineering, OpenAI API, LangChain workflows.' },
                  { label: 'AI Chatbot', desc: 'Full-stack AI chatbot with GPT-4o-mini, RAG via ChromaDB, multi-turn memory, JWT auth, follow-up suggestions, and a resizable widget.' },
                  { label: 'Payments & Quality', desc: 'Stripe payment systems, end-to-end QA automation, test-driven development mindset.' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-2">
                <a href={RESUME_URL} target="_blank" rel="noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-sm"><FileText className="mr-2 h-4 w-4" />Download PDF</Button>
                </a>
                <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 text-sm"><LucideGithub className="mr-2 h-4 w-4" />GitHub</Button>
                </a>
                <a href={LINKEDIN} target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 text-sm"><LucideLinkedin className="mr-2 h-4 w-4" />LinkedIn</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
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

  return (
    <section id="contact" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Contact</h2>
        </div>
      </FadeIn>
      <div className="grid md:grid-cols-2 gap-4">
        <FadeIn delay={0.1}>
          <Card className="hover:border-slate-300 dark:hover:border-white/20 transition-colors">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Get in touch</CardTitle></CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
                {/* Honeypot — hidden from real users, bots fill it in */}
                <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                <Input name="name" placeholder="Your name" required className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-blue-400/60" />
                <Input name="email" type="email" placeholder="Your email" required className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-blue-400/60" />
                <Textarea name="message" placeholder="Message" rows={5} required className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-blue-400/60 resize-none" />
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-500">
                    {sending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending…</>) : 'Send Message'}
                  </Button>
                </div>
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-emerald-600 dark:text-emerald-400">
                      ✓ Message sent! I'll get back to you soon.
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-rose-500 dark:text-rose-400">
                      Something went wrong. Try <a href={LINKEDIN} className="underline hover:text-rose-400">LinkedIn</a>.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Card className="hover:border-slate-300 dark:hover:border-white/20 transition-colors">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Connect</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { href: `https://github.com/${GITHUB_USER}`, icon: <LucideGithub className="h-4 w-4" />, label: `github.com/${GITHUB_USER}` },
                  { href: LINKEDIN, icon: <LucideLinkedin className="h-4 w-4" />, label: 'linkedin.com/in/chunchenglee326' },
                  { href: `mailto:${EMAIL}`, icon: <Mail className="h-4 w-4" />, label: EMAIL },
                ].map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-200 dark:hover:border-white/20 transition-all group">
                    <span className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-xs">{item.label}</span>
                  </a>
                ))}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-400 text-xs">
                  <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400" /> {LOCATION} &nbsp;·&nbsp; <Languages className="h-4 w-4 text-blue-500 dark:text-blue-400" /> {LANGUAGES.join(' • ')}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
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
    <footer className="py-10 text-center border-t border-slate-200 dark:border-white/5 mt-4 space-y-2">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} {NAME} · Built with Next.js, Tailwind &amp; Framer Motion
      </p>
      <div className="flex items-center justify-center gap-3 text-xs text-slate-300 dark:text-slate-600">
        {views !== null && (
          <span>{views.toLocaleString()} visits</span>
        )}
        <span>·</span>
        <button
          onClick={() => openPalette(true)}
          className="hover:text-slate-500 dark:hover:text-slate-400 transition"
        >
          Press <kbd className="font-sans">⌘K</kbd> to navigate
        </button>
      </div>
    </footer>
  )
}
