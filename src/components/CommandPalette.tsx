'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Code2, FileText, Mail, LucideGithub, LucideLinkedin,
  LucideInstagram, ExternalLink, Copy, Check,
} from 'lucide-react'
import { useCommandPalette } from './CommandPaletteContext'
import { scrollToSection } from './experience/scrollStore'

const GITHUB = 'https://github.com/calvinlee326'
const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
const RESUME_URL = 'https://drive.google.com/file/d/1IdgzCeSSrZgQ_iYf0er2amxe0KF3zIhl/view?usp=sharing'
const EMAIL = 'chunchenglee@outlook.com'

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

interface Item {
  id: string
  label: string
  icon: React.ReactNode
  onSelect: () => void
}

// Static items — defined outside the component so they are not recreated on each render
const NAV_ITEMS: Item[] = [
  { id: 'projects', label: 'Go to Projects', icon: <Code2 className="h-4 w-4" />, onSelect: () => scrollToSection('projects') },
  { id: 'skills', label: 'Go to Skills', icon: <Zap className="h-4 w-4" />, onSelect: () => scrollToSection('skills') },
  { id: 'resume', label: 'Go to Resume', icon: <FileText className="h-4 w-4" />, onSelect: () => scrollToSection('resume') },
  { id: 'contact', label: 'Go to Contact', icon: <Mail className="h-4 w-4" />, onSelect: () => scrollToSection('contact') },
]

const LINK_ITEMS: Item[] = [
  { id: 'github', label: 'Open GitHub', icon: <LucideGithub className="h-4 w-4" />, onSelect: () => openExternal(GITHUB) },
  { id: 'linkedin', label: 'Open LinkedIn', icon: <LucideLinkedin className="h-4 w-4" />, onSelect: () => openExternal(LINKEDIN) },
  { id: 'instagram', label: 'Open Instagram', icon: <LucideInstagram className="h-4 w-4" />, onSelect: () => openExternal('https://instagram.com/calvinlee326') },
  { id: 'resume-pdf', label: 'View Resume PDF', icon: <ExternalLink className="h-4 w-4" />, onSelect: () => openExternal(RESUME_URL) },
]

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const [copied, setCopied] = useState(false)

  const toggle = useCallback(() => setOpen(!open), [open, setOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setOpen, toggle])

  // ACTION_ITEMS depends on `copied` state, so built with useMemo
  const ACTION_ITEMS: Item[] = useMemo(() => [
    {
      id: 'copy-email',
      label: 'Copy Email Address',
      icon: copied ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />,
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
      onSelect: () => { scrollToSection('contact'); setOpen(false) },
    },
  ], [copied, setOpen])

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
                className="border border-neutral-200 bg-white shadow-2xl overflow-hidden"
                loop
              >
                <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
                  <Code2 className="h-4 w-4 text-neutral-400 shrink-0" />
                  <Command.Input
                    placeholder="Search or jump to…"
                    className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                  <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 bg-neutral-100">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-80 overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-sm text-neutral-400">
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
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-neutral-400"
    >
      {items.map((item) => (
        <Command.Item
          key={item.id}
          value={item.label}
          onSelect={() => onSelect(item.onSelect)}
          className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 cursor-pointer
            data-[selected=true]:bg-neutral-100 data-[selected=true]:text-neutral-900
            hover:bg-neutral-50 transition-colors"
        >
          <span className="text-neutral-400">{item.icon}</span>
          {item.label}
        </Command.Item>
      ))}
    </Command.Group>
  )
}
