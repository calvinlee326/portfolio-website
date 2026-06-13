# 3D Hero + Site-Wide Motion — Design Spec

Date: 2026-06-12
Status: Approved (design), pending implementation plan

## Goal

Give the portfolio a real WebGL 3D hero centerpiece plus a cohesive motion
language across every section, using the best animation tool per effect.
Keep the existing `page.tsx` structure; add motion in place rather than
rebuilding the page.

## Decisions (from brainstorming)

- **3D approach:** Hybrid — real WebGL hero + lightweight motion polish elsewhere.
- **Scope:** Whole site.
- **Library policy:** Best tool per effect. Keep Framer Motion (already used) for
  scroll reveals / layout; add `three` + R3F for the hero; add anime.js for
  timeline/stagger/SVG effects where it beats Framer Motion. anime.js is used
  where it wins, not as a blanket replacement.
- **Hero centerpiece:** A single distorted glowing orb (icosahedron with
  `MeshDistortMaterial`) that morphs slowly and tilts toward the cursor, with
  subtle bloom. Palette follows the existing blue → cyan → emerald gradient and
  the dark/light theme.

## Stack / Versions

- Existing: Next 16.2.9, React 19.2.7, Tailwind 3.4, framer-motion 12, next-themes.
- New deps:
  - `three`
  - `@react-three/fiber` v9 (React 19 compatible)
  - `@react-three/drei` v10
  - `animejs` v4 (ESM, named `animate` / `createTimeline` API)
  - Optional: `@react-three/postprocessing` for bloom (only if it stays cheap).

## Architecture

### New files

- `src/components/Hero3D.tsx`
  - Loaded from the hero via `next/dynamic(..., { ssr: false })`.
  - Owns the `<Canvas>`, camera, lights, and the offscreen-pause + reduced-motion
    logic. Renders nothing heavy on the server; keeps `three` out of the initial
    bundle.
- `src/components/hero/Scene.tsx`
  - The 3D content: a distorted icosahedron with `MeshDistortMaterial`,
    animated via `useFrame`. Reacts to pointer (tilt/lerp toward cursor) and to
    scroll (subtle scale/opacity). Colors derived from the active theme.
- `src/lib/anime.ts`
  - Small reusable helpers so each section opts in with one line:
    - `useAnimeReveal(ref, opts)` — scroll-triggered staggered reveal
      (IntersectionObserver + anime.js timeline).
    - `magnetic(el)` — magnetic hover for CTA buttons.
    - `countUp(el, to)` — animated number counter (e.g. repo stars/forks).
    - `drawSVG(el)` — SVG stroke draw-on for underlines/dividers.

### Edits to existing files

- `src/app/page.tsx`
  - Hero section: mount `Hero3D` behind the existing typewriter/text. Canvas is
    `position: absolute`, `pointer-events: none`; text stays interactive on top.
  - Showcase / Skills / Projects / Resume / Contact: attach the `lib/anime.ts`
    helpers to existing elements (reveals, magnetic CTAs, counters, SVG draws).
    No structural/section refactor — minimal, in-place edits only.
- `package.json` — new dependencies.

## Data / control flow

1. Hero mounts → `next/dynamic` loads `Hero3D` client-side only.
2. `Hero3D` checks `prefers-reduced-motion`:
   - reduced → render a static CSS gradient fallback (no canvas, no anime loops).
   - normal → mount `<Canvas>` with `Scene`.
3. `Scene` runs `useFrame`: orb distortion noise advances; mesh rotation/tilt
   lerps toward pointer; scroll progress feeds subtle scale/opacity.
4. IntersectionObserver pauses the frame loop when the hero leaves the viewport.
5. Other sections: each registers its anime.js effect on mount via the helpers;
   IntersectionObserver triggers reveals once when scrolled into view.

## Performance & accessibility

- `three` is lazy-loaded only when the hero mounts (dynamic import, `ssr:false`).
- `prefers-reduced-motion`: static fallback for the hero; anime.js loops disabled.
- Mobile / low-end: cap `dpr` to ~1.5, reduce geometry detail, and pause
  `useFrame` when offscreen (battery/CPU).
- LCP must not regress: text renders first; canvas fades in after it is
  interactive.
- Theme-aware: orb and lighting colors switch with dark/light.

## Out of scope

- No page/section component refactor (respect "only change what's asked").
- No test infrastructure added (none exists); verification is a manual checklist.
- No scrollytelling / pinned-scene scene transitions (rejected approach C).

## Verification (manual checklist)

1. `next build` completes clean.
2. Lighthouse performance shows no LCP regression vs. current.
3. `prefers-reduced-motion` path renders static fallback, no canvas.
4. Throttled GPU / mobile viewport stays smooth; offscreen pause confirmed.
5. Dark and light themes both render correct orb/scene colors.

## Phasing

1. Add deps + `Hero3D` scaffold (lazy load + reduced-motion fallback).
2. Build `Scene`: distorted orb, pointer + scroll reactivity, theme colors,
   optional bloom.
3. Add `lib/anime.ts` helpers; apply across all sections in place.
4. Performance + a11y passes (DPR cap, offscreen pause, reduced motion);
   run the verification checklist.
