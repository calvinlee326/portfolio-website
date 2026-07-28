---
target: the homepage (/)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-07-28T19-57-07Z
slug: src-app-page-tsx
---
Method: dual-agent (A: design-review agent · B: detector agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Typing caret, loading/sending states, scroll progress bar solid; no cue of journey length in a 600vh scroll |
| 2 | Match System / Real World | 3 | Terminal vocabulary authentic for the audience; `./contact.sh` may lose non-technical recruiters |
| 3 | User Control and Freedom | 1 | Terminal body unscrollable and force-pinned to bottom (Terminal.tsx:55-59, 74-76); theme toggle a no-op on `/`; palette nav broken |
| 4 | Consistency and Standards | 3 | Prompt/window chrome consistent; palette styled light-mode + blue accent, alien to the hard-dark experience; CTA colors split (sky vs emerald) |
| 5 | Error Prevention | 2 | Honeypot + required fields good; projects have no fallback despite curated local data |
| 6 | Recognition Rather Than Recall | 1 | No visible section index; palette hidden behind ⌘K and its nav is broken; static fallback has no navigation at all |
| 7 | Flexibility and Efficiency | 2 | Palette exists but all four "Go to…" accelerators fail on `/` enhanced mode |
| 8 | Aesthetic and Minimalist Design | 3 | Cohesive restrained palette; ~50-chip skills wall in 11 categories undercuts it |
| 9 | Error Recovery | 2 | Contact error offers LinkedIn alternative (good); repos error is a dead end with no GitHub profile link |
| 10 | Help and Documentation | 2 | "scroll to enter" hint disappears at 4% progress; the 4%→42% zone has no affordance; static mode has zero orientation cues |
| **Total** | | **22/40** | **Acceptable — significant improvements needed** |

## Design Specificity Verdict

**LLM assessment:** Genuinely authored, not category-interchangeable. The scroll-dive into a CRT monitor floating in space, the `visitor@portfolio:~$` zsh prompt, and above all the `git log --oneline` conceit — real GitHub repos rendered as commit lines with hashes derived from repo IDs (src/components/experience/blocks/Projects.tsx:32) — could only belong to a developer's portfolio. The live Spotify + visitor count status bar is a personal signature. Two caveats: "terminal portfolio" is itself a recognizable genre, so specificity comes from execution, not concept; and the fiction breaks exactly at the persuasion moments (rounded sky-blue resume button, Google Drive iframe, soft contact form), falling back to generic Tailwind idiom.

**Deterministic scan:** 3 findings. One genuine: `animate-bounce` on the scroll-cue arrow (src/app/page.tsx:95, bounce-easing rule). Two false positives: `text-slate-950` on `bg-sky-500`/`bg-emerald-500` (Terminal.tsx:132, Contact.tsx:63) flagged as gray-on-color, but slate-950 is near-black — these are high-contrast accent buttons (~7:1 and ~8:1), comfortably above WCAG AA. The detector matched the palette name, not the lightness.

**Visual overlays:** not available — Playwright/Puppeteer is not installed, so no browser injection was attempted; both assessments worked from source (fallback signal: static analysis only).

## Overall Impression

The bones are excellent: one Terminal component serves both the 3D scrub and the static fallback from a single content source, and the git-log-as-portfolio conceit fuses metaphor with the actual proof of ability. But the experience currently fights its own visitors at the moments that matter: content taller than the viewport is physically unreadable, the command palette's navigation silently fails, and the page's core content has a single point of failure on the GitHub API. The single biggest opportunity is making the spectacular shell reliably deliver the projects.

## What's Working

1. **Progressive-enhancement architecture** (src/app/page.tsx:14-37, 101-106): SSR, reduced-motion, touch, narrow, and no-WebGL users all get real HTML from one source of truth (src/lib/content.ts). Rarely done this cleanly.
2. **The `git log` conceit** (Projects.tsx:31-58): real repos as commit lines with language dots, star counts, and `live↗` links — content and metaphor fused, directly serving the "judge my work" goal.
3. **Performance discipline**: lazy `three` import (page.tsx:12), dpr cap 1.5 (SceneCanvas.tsx:12), rAF-coalesced scroll store (scrollStore.ts:22-26), cached repos API.

## Priority Issues

**[P0] Terminal history is clipped and unreachable in enhanced mode**
- **What**: The fixed-variant terminal body is `h-[64vh] overflow-hidden` (Terminal.tsx:74-76) and an effect force-pins `scrollTop = scrollHeight` on every progress change (Terminal.tsx:55-59). Any block taller than 64vh — the 9-repo projects list, the skills grid on short viewports — has its top rows permanently unreadable. Wheel-scrolling the terminal does nothing; scrolling the page rewinds the typing instead.
- **Why it matters**: The primary content (early repos in the list) can be literally impossible to read. This defeats the site's stated purpose.
- **Fix**: Switch to `overflow-y-auto` once a section is fully revealed, or pin to the top of the active command rather than the bottom.
- **Suggested command**: /impeccable polish

**[P1] Command palette navigation is broken on `/`**
- **What**: All four NAV_ITEMS call `scrollIntoView` on ids inside the terminal (CommandPalette.tsx:29-32), but in enhanced mode the terminal is `position:fixed` in an `overflow-hidden` body while the scroll driver is a separate 600vh spacer (page.tsx:79). `scrollIntoView` never moves the page; "Go to Projects" appears to do nothing.
- **Why it matters**: The one power-user accelerator on the site silently fails; Alex-types conclude the site is broken.
- **Fix**: Map section ids to progress targets and `window.scrollTo({top: progressTarget * scrollMax})` when enhanced.
- **Suggested command**: /impeccable polish

**[P1] Fallback users lose all chrome**
- **What**: TopBar renders only inside Enhanced (page.tsx:88); StaticExperience is a bare `<main><Terminal/></main>` (StaticExperience.tsx:6-12). Mobile, reduced-motion, and no-WebGL visitors get no name header, no `classic↗` escape, no theme toggle, no palette — and the palette has no touch entry point anywhere.
- **Why it matters**: The audiences most likely to need orientation get the least of it.
- **Fix**: Render TopBar in both branches; add a touch-visible palette trigger.
- **Suggested command**: /impeccable adapt

**[P1] Projects are single-pointed on the GitHub API**
- **What**: On failure, the core content collapses to "error: could not reach github" (Projects.tsx:27) — no retry, no link out — despite REPO_DESCRIPTIONS and LIVE_DEMOS existing locally (content.ts:33-49).
- **Why it matters**: A recruiter hitting one API hiccup sees an error where the proof of ability should be, and closes the tab.
- **Fix**: Render a curated local list on error (names + descriptions + live/GitHub links); always link the GitHub profile in the error state.
- **Suggested command**: /impeccable harden

**[P2] Dead controls and missing a11y structure**
- **What**: The theme toggle (page.tsx:58) is a visible no-op — `/` hard-codes dark with no `dark:` variants. Contact labels lack `htmlFor`/`id` association (Contact.tsx:49-58). The terminal contains no headings or `h1` at all; the owner's name is a plain body-size div (Terminal.tsx:80).
- **Why it matters**: A visible control that does nothing erodes trust in everything else; missing labels and landmarks break screen-reader navigation and weaken SEO on a page whose job is to be found and read.
- **Fix**: Drop the toggle from `/` (dark is a legitimate creative commitment); associate labels; add a terminal-styled `h1`.
- **Suggested command**: /impeccable harden

## Persona Red Flags

**Jordan (confused first-timer)**: Stops scrolling at 20% progress — hint gone (threshold 0.04, page.tsx:70), terminal invisible, only a drifting monitor in space. "classic↗" (page.tsx:56) gives no clue it's the conventional-layout escape.

**Sam (screen reader / keyboard)**: Unlabeled form fields (Contact.tsx:49-58); zero headings/landmarks in Terminal.tsx; in enhanced mode the opacity-0 terminal stays in the accessibility tree with partially-sliced command text — a confusing read order. Keyboard page-scroll does drive the experience, which is good.

**Casey (distracted mobile)**: Correctly gets the static page with no three.js download — but no header at all, a ~50-chip skills wall, and an eagerly-loaded Google Drive resume iframe (Terminal.tsx:125-127) on a slow pipe.

**Recruiter with 90 seconds and 40 tabs**: ~350vh of scrolling before `git log` appears (projects sit at ~70% of a 600vh journey). If GitHub hiccups, they see an error line and close the tab. Fast scroll-to-bottom works (the scrub isn't time-gated) but must be discovered, and then the terminal is pinned to contact with earlier repos clipped (P0).

## Minor Observations

- Canvas keeps rendering at full frame rate behind the terminal forever — `canvasOpacity` floors at 0.15 (page.tsx:69); nothing pauses the frameloop during the longest-dwell reading phase. Battery cost.
- Skills taxonomy unedited: 11 categories, near-duplicates ('AI / LLM Integration' vs 'AI Dev Tools' list the same tools, content.ts:16, 21). For a QA-discipline pitch, this reads as a missed review pass. Consolidate to 4–6.
- CommandPalette.tsx:11-14 re-declares GITHUB/LINKEDIN/RESUME_URL/EMAIL instead of importing content.ts (drift risk), and offers Instagram, which appears nowhere else on `/`.
- ⌘K shown as the mac symbol only (page.tsx:50); Ctrl+K works but Windows users will never guess.
- `text-[11px] text-slate-500` status bar and `text-xs text-slate-500` repo descriptions on `#070a12` sit near the small-text contrast floor.
- `animate-bounce` scroll cue (page.tsx:95) — detector-flagged; a subtler pulse would fit the restrained world better.
- globals.css orb/aurora rules (globals.css:25-70) are `/classic`-only dead weight shipped to `/`.
- "portfolio.os v1.0 … status: open to work" on the 3D monitor (Monitor.tsx:44-48) is a strong persuade signal that static/mobile users never see.
- `console.error` in production path (content.ts:110).

## Questions to Consider

1. If success is "visitor explores project work," why is `git log` the fourth command at ~70% of a 600vh scroll instead of the first thing after `whoami`? What would the experience lose by putting the proof before the preamble?
2. The fiction breaks precisely at the two highest-stakes moments (resume, contact) with generic rounded buttons and a Drive iframe. Should those commit harder to the fiction (`open resume.pdf`, `mail -s`), or is breaking the fiction the right persuasion move — and if so, why not break it more confidently?
3. Dark-space is clearly the creative commitment — so who is the theme toggle for, and who is "classic↗" for? If the answer is "recruiters who don't want the experience," neither control currently says that to them.
