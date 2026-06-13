'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import {
  NAME, LOCATION, LANGUAGES, BIO, SKILLS, RESUME_URL, RESUME_SUMMARY,
  toDrivePreview, EMAIL, LINKEDIN, GITHUB_USER,
} from '@/lib/content'
import { rangeProgress } from './util'
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
        <span className="text-slate-600">:</span>
        <span className="text-sky-400">~</span>
        <span className="text-slate-500">$</span>
        <span className="text-slate-100">{shown}</span>
        {!done && <Caret />}
      </div>
      <div
        className={`mt-2 pl-1 transition-all duration-500 ${
          done ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
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
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-[#070a12]/95 shadow-2xl shadow-black/50 backdrop-blur">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-500/90" />
        <span className="h-3 w-3 rounded-full bg-amber-400/90" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
        <span className="ml-2 text-xs text-slate-500">visitor@portfolio: ~ — zsh</span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className={`px-5 py-5 font-mono text-sm leading-relaxed text-slate-300 ${
          variant === 'fixed' ? 'h-[64vh] overflow-hidden' : ''
        }`}
      >
        <Command cmd="whoami" localP={localP} start={0} end={0.05}>
          <div className="space-y-0.5">
            <div className="text-slate-100">{NAME}</div>
            <div className="text-slate-400">
              {LOCATION} · {LANGUAGES.join(' / ')}
            </div>
          </div>
        </Command>

        <Command cmd="cat about.txt" localP={localP} start={0.09} end={0.16}>
          <p className="max-w-2xl text-slate-300">{BIO}</p>
        </Command>

        <Command cmd="ls skills/" localP={localP} start={0.22} end={0.3} id="skills">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(SKILLS).map(([category, items]) => (
              <div key={category}>
                <div className="text-sky-400">{category}/</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <span key={s} className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Command>

        <Command cmd="git log --oneline" localP={localP} start={0.4} end={0.48} id="projects">
          <Projects />
        </Command>

        <Command cmd="cat resume.pdf" localP={localP} start={0.6} end={0.68} id="resume">
          <div className="space-y-4">
            <div className="space-y-2">
              {RESUME_SUMMARY.map((item) => (
                <div key={item.label} className="flex gap-2">
                  <span className="text-emerald-400">▸</span>
                  <div>
                    <span className="text-slate-100">{item.label}</span>
                    <span className="text-slate-400"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg border border-white/10">
              <iframe src={toDrivePreview(RESUME_URL)} title="Resume preview" className="h-full w-full" allow="autoplay" />
            </div>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded bg-sky-500/90 px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400"
            >
              download resume ↓
            </a>
          </div>
        </Command>

        <Command cmd="./contact.sh" localP={localP} start={0.8} end={0.88} id="contact">
          <div className="space-y-4">
            <Contact />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" className="hover:text-sky-300">
                github/{GITHUB_USER}
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="hover:text-sky-300">
                linkedin
              </a>
              <a href={`mailto:${EMAIL}`} className="hover:text-sky-300">
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
