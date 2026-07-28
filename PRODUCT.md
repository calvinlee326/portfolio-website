# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Broader professional network evaluating Chun-Cheng Lee: recruiters and hiring managers, but also potential collaborators, clients, and general professional contacts. Not narrowly job-search-only — the site should read as credible to anyone assessing his work, not just ATS-style screeners.

## Product Purpose

Personal portfolio for Chun-Cheng Lee (backend-leaning software engineer). It exists to demonstrate real, working technical output — projects, code, skills — so a visitor can judge his ability directly rather than take a resume's word for it. Success is a visitor exploring the actual project work (live demos, GitHub) and coming away convinced of his capability.

## Positioning

Backend-focused engineer (Python/Django, REST APIs) who also ships AI integrations (GPT-4o Vision, RAG, LangChain) and payment systems (Stripe billing/webhooks) with a QA/test-automation discipline. The combination of backend rigor + applied AI + payments + testing is the differentiator — not just another frontend-portfolio-with-projects-list.

## Operating Context

- Primary experience at `/`: an interactive 3D "dev terminal" scene (WebGL/Canvas, scroll-driven camera) presenting bio, skills, projects, resume, and contact as terminal commands.
- Secondary `/classic` route: a conventional scrolling one-page layout with the same content, for users/devices where the 3D experience isn't the right fit.
- Live GitHub repo data fetched via `/api/repos`; contact form backed by `/api/contact` with Upstash Redis rate limiting; resume served via an embedded Google Drive preview + download link; Spotify integration at `/api/spotify`.
- The primary CTA is exploration of project work (live demos, GitHub links) rather than immediately driving to a contact form or resume download — those remain available but secondary.

## Capabilities and Constraints

- Built with Next.js (App Router), React, TypeScript, Tailwind CSS; deployed on Vercel with Vercel Analytics.
- Shared content model lives in `src/lib/content.ts` (bio, skills, project descriptions, resume link, contact links) and is treated as current, confirmed fact — not stale.
- Framer Motion and custom scroll-store utilities drive motion/animation on both `/` and `/classic`.
- Command palette (`cmdk`) provides quick navigation/actions site-wide.
- `/classic` is a permanent first-class alternate route: the fallback for no-WebGL/reduced-motion users and anyone preferring a conventional layout. Both experiences are maintained from the shared content model.

## Brand Commitments

- Name: Chun-Cheng Lee (displayed as "Chun‑Cheng Lee"). Location: Los Angeles, CA. Languages: English, Mandarin, Taiwanese.
- Real, verifiable links only: GitHub (`calvinlee326`), LinkedIn, resume (Google Drive), email — no placeholder/fabricated contact info.

## Evidence on Hand

- Real project list with descriptions in `REPO_DESCRIPTIONS` (`src/lib/content.ts`), including live demos for `blackjack`, `scoreboard`, and `palm-reading-app`.
- Live GitHub repo data via the GitHub API (`/api/repos`).
- Actual resume file (Google Drive-hosted PDF) embedded and downloadable.
- No testimonials, press, or third-party case studies exist — future work must not fabricate these.

## Product Principles

1. Real work over claims — every credential (project, skill, link) must be something a visitor can actually click into and verify.
2. Backend-first identity — AI and payments work are presented as extensions of solid backend engineering, not a pivot away from it.
3. Exploration over conversion pressure — the site rewards browsing (projects, code, live demos) rather than funneling visitors hard toward a single contact CTA.
4. One content source of truth — bio/skills/projects live in `src/lib/content.ts` and both the 3D and classic experiences must stay consistent with it.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond standard web accessibility practice; the 3D experience should degrade gracefully for users who can't or don't want WebGL/motion-heavy interaction (the existing `/classic` route already serves this need).
