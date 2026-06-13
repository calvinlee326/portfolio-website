export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

// Local 0→1 progress for a sub-range of the global scroll progress.
export function rangeProgress(p: number, start: number, end: number): number {
  if (end <= start) return p >= end ? 1 : 0
  return clamp01((p - start) / (end - start))
}
