'use client'
import { useEffect, useRef, type ReactNode } from 'react'
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
        <span className="text-emerald-400">visitor@portfolio</span>
        <span className="text-neutral-600">:</span>
        <span className="text-neutral-400">~</span>
        <span className="text-neutral-500">$</span>
        <span className="text-neutral-100">{shown}</span>
        {!done && <Caret />}
      </div>
      {/* max-h-0 collapses unrevealed output so the scrollable body only ever
          contains typed history — otherwise hidden content inflates scrollHeight
          and the bottom-pin clips revealed lines out of reach. */}
      <div
        className={`mt-2 pl-1 transition-all duration-500 ${
          done ? 'translate-y-0 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden translate-y-2 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export function Terminal({ progress, variant }: { progress: number; variant: 'fixed' | 'static' }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const localP = variant === 'static' ? 1 : rangeProgress(progress, 0.5, 1)

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

        <div className="pb-10" />
      </div>

      {/* Status bar */}
      <div className="border-t border-white/10 bg-white/5 px-5 py-2">
        <StatusBar />
      </div>
    </div>
  )
}
