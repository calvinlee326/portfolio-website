export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

// Local 0→1 progress for a sub-range of the global scroll progress.
export function rangeProgress(p: number, start: number, end: number): number {
  if (end <= start) return p >= end ? 1 : 0
  return clamp01((p - start) / (end - start))
}

// Reveal schedule for the terminal: the localP (0–1 within the terminal scrub)
// range each command types over. Single source of truth for Terminal's blocks
// and the command palette's section jumps.
export const SCHEDULE = {
  whoami: { start: 0, end: 0.05 },
  projects: { start: 0.09, end: 0.17 },
  about: { start: 0.26, end: 0.33 },
  skills: { start: 0.4, end: 0.48 },
  resume: { start: 0.6, end: 0.68 },
  contact: { start: 0.8, end: 0.88 },
} as const
