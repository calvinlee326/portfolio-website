'use client'
import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Code2, FileText, Mail, LucideGithub, LucideLinkedin,
  LucideInstagram, ExternalLink, Copy, Check,
} from 'lucide-react'

const GITHUB = 'https://github.com/calvinlee326'
const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
const RESUME_URL = 'https://drive.google.com/file/d/1BSBaHCnNDVzVW-mEGur0F76NA1u1KCEC/view?usp=sharing'
const EMAIL = 'chunchenglee@outlook.com'

interface Item {
  id: string
  label: string
  icon: React.ReactNode
  onSelect: () => void
}

const NAV_ITEMS: Item[] = [
  { id: 'skills', label: 'Go to Skills', icon: <Zap className="h-4 w-4" />, onSelect: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'projects', label: 'Go to Projects', icon: <Code2 className="h-4 w-4" />, onSelect: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'resume', label: 'Go to Resume', icon: <FileText className="h-4 w-4" />, onSelect: () => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'contact', label: 'Go to Contact', icon: <Mail className="h-4 w-4" />, onSelect: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
]

const LINK_ITEMS: Item[] = [
  { id: 'github', label: 'Open GitHub', icon: <LucideGithub className="h-4 w-4" />, onSelect: () => window.open(GITHUB, '_blank') },
  { id: 'linkedin', label: 'Open LinkedIn', icon: <LucideLinkedin className="h-4 w-4" />, onSelect: () => window.open(LINKEDIN, '_blank') },
  { id: 'instagram', label: 'Open Instagram', icon: <LucideInstagram className="h-4 w-4" />, onSelect: () => window.open('https://instagram.com/calvinlee326', '_blank') },
  { id: 'resume-pdf', label: 'View Resume PDF', icon: <ExternalLink className="h-4 w-4" />, onSelect: () => window.open(RESUME_URL, '_blank') },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggle = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  const ACTION_ITEMS: Item[] = [
    {
      id: 'copy-email',
      label: 'Copy Email Address',
      icon: copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />,
      onSelect: () => {
        navigator.clipboard.writeText(EMAIL)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
    },
    {
      id: 'contact-me',
      label: 'Go to Contact Form',
      icon: <Mail className="h-4 w-4" />,
      onSelect: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) },
    },
  ]

  function runAndClose(fn: () => void) {
    fn()
    setOpen(false)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <motion.div
              key="palette"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
            >
              <Command
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
                loop
              >
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 px-4 py-3">
                  <Code2 className="h-4 w-4 text-blue-400 shrink-0" />
                  <Command.Input
                    placeholder="Search or jump to…"
                    className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                  />
                  <kbd className="hidden sm:flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-white/10">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-80 overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-sm text-slate-400">
                    No results found.
                  </Command.Empty>

                  <CommandGroup label="Navigation" items={NAV_ITEMS} onSelect={(fn) => runAndClose(fn)} />
                  <CommandGroup label="Links" items={LINK_ITEMS} onSelect={(fn) => runAndClose(fn)} />
                  <CommandGroup label="Actions" items={ACTION_ITEMS} onSelect={(fn) => runAndClose(fn)} />
                </Command.List>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function CommandGroup({ label, items, onSelect }: { label: string; items: Item[]; onSelect: (fn: () => void) => void }) {
  return (
    <Command.Group
      heading={label}
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-blue-400"
    >
      {items.map((item) => (
        <Command.Item
          key={item.id}
          value={item.label}
          onSelect={() => onSelect(item.onSelect)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 cursor-pointer
            data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-300
            hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <span className="text-slate-400 dark:text-slate-500 group-data-[selected=true]:text-blue-400">{item.icon}</span>
          {item.label}
        </Command.Item>
      ))}
    </Command.Group>
  )
}
