'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { LucideGithub, LucideLinkedin, LucideInstagram, Mail, FileText, MapPin, Languages, ExternalLink, ArrowRight, Star, Code2, Loader2, ChevronLeft, ChevronRight, GitFork } from 'lucide-react'
import { motion } from 'framer-motion'

// ==== CONFIG ================================================================
const NAME = 'Chun-Cheng Lee'
const LOCATION = 'Los Angeles, CA'
const LANGUAGES = ['English', 'Mandarin', 'Taiwanese']
const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
const GITHUB_USER = 'calvinlee326'
const RESUME_URL = 'https://drive.google.com/file/d/1BSBaHCnNDVzVW-mEGur0F76NA1u1KCEC/view?usp=sharing'
const EMAIL = 'chunchenglee@outlook.com'
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

const HIGHLIGHTS = [
  'Backend-focused SWE (Python/Django, FastAPI)',
  'Stripe payments • REST APIs • Postgres',
  'AI apps with LLMs (GPT-4o Vision, prompt engineering)',
]

function toDrivePreview(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const fileId = parts.find((p) => p && p.length > 20)
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url
  } catch {
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

export default function Page() {
  const roles = useMemo(() => ['Software Engineer', 'Backend Developer', 'Quality Assurance', 'AI Enthusiast'], [])
  const typed = useTypewriter(roles)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Hero typed={typed} />
        <Highlights />
        <Actions />
        <Projects />
        <Resume />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}

function SiteNav() {
  const links = [ { href: '#projects', label: 'Projects' }, { href: '#resume', label: 'Resume' }, { href: '#contact', label: 'Contact' } ]
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="#top" className="font-black tracking-tight text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-300">Chun‑Cheng</span>
          <span className="ml-1 text-slate-300">Lee</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-300 hover:text-white transition">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Socials compact />
        </div>
      </div>
    </header>
  )
}

function Hero({ typed }: { typed: string }) {
  return (
    <section id="top" className="py-14 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 drop-shadow-sm">{NAME}</span>
        </h1>
        <p className="mt-3 text-lg text-slate-300">
          <span className="align-middle">{typed}</span>
          <span className="ml-1 animate-pulse">▌</span>
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-300">
          <MapPin className="h-4 w-4" /> {LOCATION}
          <div className="mx-2 h-3 w-px bg-white/20" />
          <Languages className="h-4 w-4" /> {LANGUAGES.join(' • ')}
        </div>
      </motion.div>
    </section>
  )
}

function Highlights() {
  return (
    <section className="pb-4">
      <div className="grid sm:grid-cols-3 gap-3">
        {HIGHLIGHTS.map((text, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-400/20">Highlight</Badge>
                  <p className="text-slate-200 text-sm">{text}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Socials({ compact = false }: { compact?: boolean }) {
  const c = (compact ? 'gap-2' : 'gap-3')
  return (
    <div className={`flex ${c}`}>
      <a aria-label="GitHub" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-white/10 p-2"><LucideGithub className="h-5 w-5" /></Button>
      </a>
      <a aria-label="LinkedIn" href={LINKEDIN} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-white/10 p-2"><LucideLinkedin className="h-5 w-5" /></Button>
      </a>
      <a aria-label="Instagram" href={`https://instagram.com/calvinlee326`} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-white/10 p-2"><LucideInstagram className="h-5 w-5" /></Button>
      </a>
    </div>
  )
}

function Actions() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-10">
      <a href={`mailto:${EMAIL}?subject=Interview%20with%20Chun-Cheng%20Lee`}><Button className="group">Contact Me <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition" /></Button></a>
      <a href={RESUME_URL} target="_blank" rel="noreferrer"><Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20"><FileText className="mr-2 h-4 w-4"/>View Resume</Button></a>
    </div>
  )
}

function Projects() {
  return (
    <section id="projects" className="py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-slate-400 mt-1">Latest from GitHub — auto-updated</p>
        </div>
        <a className="text-sm text-slate-300 hover:text-white flex items-center gap-1" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">See all <ExternalLink className="h-4 w-4"/></a>
      </div>
      <ProjectCarousel />
    </section>
  )
}

function ProjectCarousel() {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const PER_PAGE = 3
  const totalPages = Math.ceil(repos.length / PER_PAGE)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=updated&type=owner`)
        const all = r.ok ? await r.json() : []
        const list = (all as any[]).filter((x) => !x.fork).slice(0, 9)
        setRepos(list)
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
      <Loader2 className="h-5 w-5 mr-2 animate-spin"/> Loading projects…
    </div>
  )
  if (err) return <p className="text-sm text-rose-300">{err}</p>

  const visible = repos.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r: any, i: number) => (
          <motion.div
            key={`${page}-${r.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <a href={r.html_url} target="_blank" rel="noreferrer" className="block h-full">
              <Card className="group h-full bg-white/5 border-white/10 hover:border-blue-400/40 hover:bg-white/8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between gap-2">
                    <span className="truncate flex items-center gap-2">
                      <Code2 className="h-4 w-4 shrink-0 text-blue-400"/>
                      <span className="group-hover:text-blue-300 transition-colors">{r.name}</span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0 text-sm">
                      {r.stargazers_count > 0 && <span className="flex items-center text-amber-300/90"><Star className="h-3.5 w-3.5 mr-0.5"/>{r.stargazers_count}</span>}
                      {r.forks_count > 0 && <span className="flex items-center text-slate-400"><GitFork className="h-3.5 w-3.5 mr-0.5"/>{r.forks_count}</span>}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col gap-3">
                  <p className="text-sm text-slate-300 line-clamp-2 min-h-[40px]">{REPO_DESCRIPTIONS[r.name] || r.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {r.language ? (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: LANG_COLORS[r.language] || '#888' }}/>
                        {r.language}
                      </span>
                    ) : <span/>}
                    <span className="text-xs text-slate-500">
                      {new Date(r.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
            <ChevronLeft className="h-5 w-5"/>
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'w-6 bg-blue-400' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
          <button onClick={next} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
            <ChevronRight className="h-5 w-5"/>
          </button>
        </div>
      )}
    </div>
  )
}

function Resume() {
  const preview = toDrivePreview(RESUME_URL)
  return (
    <section id="resume" className="py-12">
      <h2 className="text-2xl font-bold mb-4">Resume</h2>
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <Card className="bg-white/5 border-white/10 overflow-hidden">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Inline Preview</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden ring-1 ring-white/10">
              <iframe src={preview} title="Resume Preview" className="w-full h-full" allow="autoplay" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-lg">About & Quick Links</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Backend‑leaning SWE experienced with Python (Django, FastAPI), SQL, and cloud deploys.</li>
              <li>• Built AI apps using GPT‑4o Vision; integrated Stripe payments; designed RESTful APIs.</li>
              <li>• Strong testing mindset from prior QA automation experience.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={RESUME_URL} target="_blank" rel="noreferrer"><Button><FileText className="mr-2 h-4 w-4"/>Open PDF</Button></a>
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer"><Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20"><LucideGithub className="mr-2 h-4 w-4"/>GitHub</Button></a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer"><Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20"><LucideLinkedin className="mr-2 h-4 w-4"/>LinkedIn</Button></a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(formRef!.current as HTMLFormElement)
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
        }),
      })
      if (res.ok) {
        setStatus('success')
        formRef.current?.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }
  return (
    <section id="contact" className="py-12">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Get in touch</CardTitle></CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
              <Input name="name" placeholder="Your name" required />
              <Input name="email" type="email" placeholder="Your email" required />
              <Textarea name="message" placeholder="Message" rows={5} required />
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={sending}>{sending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Sending…</>) : 'Send'}</Button>
                {status === 'success' && <p className="text-sm text-emerald-400">Message sent! I'll get back to you soon.</p>}
                {status === 'error' && <p className="text-sm text-rose-400">Something went wrong. Please try <a href={LINKEDIN} className="underline hover:text-rose-300">LinkedIn</a>.</p>}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Connect</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <a className="inline-flex items-center gap-2 hover:text-white text-slate-300" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer"><LucideGithub className="h-4 w-4"/> github.com/{GITHUB_USER}</a>
              <a className="inline-flex items-center gap-2 hover:text-white text-slate-300" href={LINKEDIN} target="_blank" rel="noreferrer"><LucideLinkedin className="h-4 w-4"/> LinkedIn</a>
              <a className="inline-flex items-center gap-2 hover:text-white text-slate-300" href={`mailto:${EMAIL}`}><Mail className="h-4 w-4"/> {EMAIL}</a>
              <div className="inline-flex items-center gap-2 text-slate-300"><MapPin className="h-4 w-4"/> {LOCATION}</div>
              <div className="inline-flex items-center gap-2 text-slate-300"><Languages className="h-4 w-4"/> {LANGUAGES.join(' • ')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-slate-400">© {new Date().getFullYear()} {NAME}. Built with Next.js, Tailwind, and shadcn/ui.</footer>
  )
}
