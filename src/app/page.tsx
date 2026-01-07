'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Github, Linkedin, Instagram, Mail, FileText, MapPin, Languages, ExternalLink, ArrowRight, Star, Code2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

// ==== CONFIG ================================================================
const NAME = 'Chun-Cheng Lee'
const LOCATION = 'Los Angeles, CA'
const LANGUAGES = ['English', 'Mandarin', 'Taiwanese']
const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
const GITHUB_USER = 'calvinlee326'
const RESUME_URL = 'https://drive.google.com/file/d/1BSBaHCnNDVzVW-mEGur0F76NA1u1KCEC/view?usp=sharing'
const EMAIL = 'chunchenglee@outlook.com'
const PINNED_REPOS = ['palm-reading-app', 'summary-extension', 'url-shortener']

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
        <Button variant="ghost" className="hover:bg-white/10 p-2"><Github className="h-5 w-5" /></Button>
      </a>
      <a aria-label="LinkedIn" href={LINKEDIN} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-white/10 p-2"><Linkedin className="h-5 w-5" /></Button>
      </a>
      <a aria-label="Instagram" href={`https://instagram.com/calvinlee326`} target="_blank" rel="noreferrer">
        <Button variant="ghost" className="hover:bg-white/10 p-2"><Instagram className="h-5 w-5" /></Button>
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
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <a className="text-sm text-slate-300 hover:text-white" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">See all <ExternalLink className="inline-block h-4 w-4 ml-1"/></a>
      </div>
      <ProjectGrid />
    </section>
  )
}

function ProjectGrid() {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    async function load() {
      try {
        const byNames = await Promise.all(
          PINNED_REPOS.map(async (name) => {
            const r = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${name}`)
            return r.ok ? r.json() : null
          })
        )
        let list = byNames.filter(Boolean) as any[]
        if (list.length === 0) {
          const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
          const all = r.ok ? await r.json() : []
          list = all.filter((x: any) => !x.fork).sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 6)
        }
        setRepos(list)
      } catch (e) {
        setErr('Could not load GitHub repos.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (<div className="py-10 flex items-center justify-center text-slate-300"><Loader2 className="h-5 w-5 mr-2 animate-spin"/> Loading projects…</div>)
  if (err) return <p className="text-sm text-rose-300">{err}</p>
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((r: any) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="group bg-white/5 border-white/10 hover:border-white/20 transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between gap-2">
                <span className="truncate flex items-center gap-2"><Code2 className="h-4 w-4 shrink-0"/> {r.name}</span>
                <span className="flex items-center text-sm text-amber-300/90"><Star className="h-4 w-4 mr-1"/>{r.stargazers_count}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-300 min-h-[42px] line-clamp-2">{r.description || 'No description provided.'}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-400">{r.language || ''}</div>
                <a href={r.html_url} target="_blank" rel="noreferrer" className="text-sm inline-flex items-center text-sky-300 hover:text-sky-200">Open <ExternalLink className="h-4 w-4 ml-1"/></a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
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
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer"><Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20"><Github className="mr-2 h-4 w-4"/>GitHub</Button></a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer"><Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20"><Linkedin className="mr-2 h-4 w-4"/>LinkedIn</Button></a>
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
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(formRef!.current as HTMLFormElement)
    const name = fd.get('name')
    const email = fd.get('email')
    const message = fd.get('message')
    setSending(true)
    const subject = encodeURIComponent(`Hello from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setTimeout(() => setSending(false), 800)
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
                <p className="text-xs text-slate-400">If send button is not working, please send an dm to <a href={`https://www.linkedin.com/in/chunchenglee326/`} className="text-sky-300 hover:text-sky-200">LinkedIn</a></p>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Connect</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <a className="inline-flex items-center gap-2 hover:text-white text-slate-300" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer"><Github className="h-4 w-4"/> github.com/{GITHUB_USER}</a>
              <a className="inline-flex items-center gap-2 hover:text-white text-slate-300" href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4"/> LinkedIn</a>
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
