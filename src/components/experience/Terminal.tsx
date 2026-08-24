'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  NAME, LOCATION, LANGUAGES, BIO, SKILLS, RESUME_URL, RESUME_SUMMARY,
  toDrivePreview, EMAIL, LINKEDIN, GITHUB_USER,
} from '@/lib/content'
import { rangeProgress, SCHEDULE } from './util'
import { Projects } from './blocks/Projects'
import { Contact } from './blocks/Contact'
import { StatusBar } from './blocks/StatusBar'

function Caret() {
  return <span className="ml-0.5 animate-pulse text-emerald-400">▌</span>
}

function PromptPrefix() {
  return (
    <>
      <span className="text-emerald-400">visitor@portfolio</span>
      <span className="text-neutral-600">:</span>
      <span className="text-neutral-400">~</span>
      <span className="text-neutral-500">$</span>
    </>
  )
}

function SkillsListing() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(SKILLS).map(([category, items]) => (
        <div key={category}>
          <div className="text-neutral-100">{category}/</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {items.map((s) => (
              <span key={s} className="bg-white/5 px-1.5 py-0.5 text-xs text-neutral-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface CommandProps {
  cmd: string
  localP: number
  start: number
  end: number
  id?: string
  children: ReactNode
}

function Command({ cmd, localP, start, end, id, children }: CommandProps) {
  const t = rangeProgress(localP, start, end)
  const shown = cmd.slice(0, Math.round(cmd.length * t))
  const done = t >= 1
  return (
    <div id={id} className="mb-6 scroll-mt-24">
      <div className="flex items-center gap-1.5">
        <PromptPrefix />
        <span className="text-neutral-100">{shown}</span>
        {!done && <Caret />}
      </div>
      {/* max-h-0 collapses unrevealed output so the scrollable body only ever
          contains typed history — otherwise hidden content inflates scrollHeight
          and the bottom-pin clips revealed lines out of reach. inert keeps the
          still-hidden links and form out of the tab order and the a11y tree. */}
      <div
        inert={!done}
        className={`mt-2 pl-1 transition-all duration-500 ${
          done ? 'translate-y-0 opacity-100' : 'max-h-0 overflow-hidden translate-y-2 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// ── INTERACTIVE SHELL ────────────────────────────────────────────────────────
const COMMANDS = [
  ['help', 'list available commands'],
  ['whoami', 'who is this'],
  ['projects', 'real repos, live from GitHub'],
  ['skills', 'what I work with'],
  ['about', 'short bio'],
  ['resume', 'summary + download'],
  ['contact', 'send me a message'],
  ['github', 'open my GitHub profile'],
  ['linkedin', 'open my LinkedIn'],
  ['classic', 'switch to the classic layout'],
  ['clear', 'clear the screen'],
] as const

function HelpOut() {
  return (
    <div className="space-y-0.5">
      {COMMANDS.map(([cmd, desc]) => (
        <div key={cmd} className="flex gap-3">
          <span className="w-20 shrink-0 text-neutral-100">{cmd}</span>
          <span className="text-neutral-500">{desc}</span>
        </div>
      ))}
    </div>
  )
}

function ResumeOut() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {RESUME_SUMMARY.map((item) => (
          <div key={item.label} className="flex gap-2">
            <span className="text-emerald-400">▸</span>
            <div>
              <span className="text-neutral-100">{item.label}</span>
              <span className="text-neutral-400">: {item.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-block bg-white px-4 py-2 font-medium text-neutral-950 transition hover:bg-neutral-200"
      >
        download resume ↓
      </a>
    </div>
  )
}

function openExternal(url: string): ReactNode {
  window.open(url, '_blank', 'noopener,noreferrer')
  return <p className="text-neutral-400">opening {url}</p>
}

function execute(raw: string): ReactNode {
  const cmd = raw.toLowerCase().replace(/\/$/, '').replace(/\s+/g, ' ')
  switch (cmd) {
    case 'help':
      return <HelpOut />
    case 'whoami':
      return (
        <div className="space-y-0.5">
          <div className="text-neutral-100">{NAME}</div>
          <div className="text-neutral-400">{LOCATION} · {LANGUAGES.join(' / ')}</div>
        </div>
      )
    case 'projects':
    case 'git log':
    case 'git log --oneline':
      return <Projects />
    case 'skills':
    case 'ls':
    case 'ls skills':
      return <SkillsListing />
    case 'about':
    case 'cat about.txt':
      return <p className="max-w-2xl text-neutral-300">{BIO}</p>
    case 'resume':
    case 'cat resume.pdf':
      return <ResumeOut />
    case 'contact':
    case './contact.sh':
      return <Contact />
    case 'email':
      return (
        <a href={`mailto:${EMAIL}`} className="text-neutral-100 underline underline-offset-4">{EMAIL}</a>
      )
    case 'github':
      return openExternal(`https://github.com/${GITHUB_USER}`)
    case 'linkedin':
      return openExternal(LINKEDIN)
    case 'classic':
      window.location.href = '/classic'
      return <p className="text-neutral-400">switching to classic layout…</p>
    default:
      return (
        <p className="text-red-400">
          command not found: {raw}. type <span className="text-neutral-100">help</span>
        </p>
      )
  }
}

interface HistoryEntry {
  cmd: string
  out: ReactNode
}

function InteractiveShell() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [value, setValue] = useState('')
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip the empty-history mount pass: the static tree always renders first,
    // so this would drag the page down to the terminal before the reveal starts
    if (history.length === 0) return
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [history])

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const cmd = value.trim()
      setValue('')
      setHistIdx(-1)
      if (!cmd) return
      if (cmd === 'clear') {
        setHistory([])
        return
      }
      // execute() navigates and opens tabs, so it cannot run inside the
      // updater — React re-invokes those, and StrictMode does it twice.
      const out = execute(cmd)
      setHistory((h) => [...h, { cmd, out }])
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = histIdx < 0 ? history.length - 1 : Math.max(histIdx - 1, 0)
      if (history[idx]) {
        setHistIdx(idx)
        setValue(history[idx].cmd)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx < 0) return
      const idx = histIdx + 1
      if (idx >= history.length) {
        setHistIdx(-1)
        setValue('')
      } else {
        setHistIdx(idx)
        setValue(history[idx].cmd)
      }
    }
  }

  return (
    <div onClick={() => inputRef.current?.focus()}>
      {history.map((h, i) => (
        <div key={i} className="mb-6">
          <div className="flex items-center gap-1.5">
            <PromptPrefix />
            <span className="text-neutral-100">{h.cmd}</span>
          </div>
          <div className="mt-2 pl-1">{h.out}</div>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <PromptPrefix />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-neutral-100 caret-emerald-400 outline-none placeholder:text-neutral-600"
          placeholder="type help"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal command input"
        />
      </div>
      <div ref={endRef} />
    </div>
  )
}

export function Terminal({ progress, variant }: { progress: number; variant: 'fixed' | 'static' }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const localP = variant === 'static' ? 1 : rangeProgress(progress, 0.5, 1)
  const replayDone = localP >= 0.999

  // In fixed mode the body follows the latest typed line like a real terminal.
  useEffect(() => {
    if (variant !== 'fixed') return
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [progress, variant])

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden border border-white/10 bg-[#0a0a0a]/95 shadow-2xl shadow-black/50 backdrop-blur">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="h-3 w-3 rounded-full bg-white/20" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-xs text-neutral-500">visitor@portfolio: ~ — zsh</span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className={`px-5 py-5 font-mono text-sm leading-relaxed text-neutral-300 ${
          variant === 'fixed' ? 'h-[64vh] overflow-y-auto' : ''
        }`}
      >
        <Command cmd="whoami" localP={localP} {...SCHEDULE.whoami}>
          <div className="space-y-0.5">
            <div className="text-neutral-100">{NAME}</div>
            <div className="text-neutral-400">
              {LOCATION} · {LANGUAGES.join(' / ')}
            </div>
          </div>
        </Command>

        {/* Proof leads: real repos right after the intro, before any preamble */}
        <Command cmd="git log --oneline" localP={localP} {...SCHEDULE.projects} id="projects">
          <Projects />
        </Command>

        <Command cmd="cat about.txt" localP={localP} {...SCHEDULE.about}>
          <p className="max-w-2xl text-neutral-300">{BIO}</p>
        </Command>

        <Command cmd="ls skills/" localP={localP} {...SCHEDULE.skills} id="skills">
          <SkillsListing />
        </Command>

        <Command cmd="cat resume.pdf" localP={localP} {...SCHEDULE.resume} id="resume">
          <div className="space-y-4">
            <div className="space-y-2">
              {RESUME_SUMMARY.map((item) => (
                <div key={item.label} className="flex gap-2">
                  <span className="text-emerald-400">▸</span>
                  <div>
                    <span className="text-neutral-100">{item.label}</span>
                    <span className="text-neutral-400">: {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-white/10">
              <iframe src={toDrivePreview(RESUME_URL)} title="Resume preview" className="h-full w-full" allow="autoplay" />
            </div>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-white px-4 py-2 font-medium text-neutral-950 transition hover:bg-neutral-200"
            >
              download resume ↓
            </a>
          </div>
        </Command>

        <Command cmd="./contact.sh" localP={localP} {...SCHEDULE.contact} id="contact">
          <div className="space-y-4">
            <Contact />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" className="hover:text-neutral-200">
                github/{GITHUB_USER}
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="hover:text-neutral-200">
                linkedin
              </a>
              <a href={`mailto:${EMAIL}`} className="hover:text-neutral-200">
                {EMAIL}
              </a>
            </div>
          </div>
        </Command>

        {/* Replay finished: hand the prompt over to the visitor. Kept mounted
            and merely hidden — unmounting on a scroll back up would wipe the
            visitor's typed history. */}
        <div hidden={!replayDone}>
          <InteractiveShell />
        </div>
        <div className="pb-10" />
      </div>

      {/* Status bar */}
      <div className="border-t border-white/10 bg-white/5 px-5 py-2">
        <StatusBar />
      </div>
    </div>
  )
}
