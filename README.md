# Portfolio Website

Personal portfolio site built with Next.js, TypeScript, and Tailwind CSS.

Live at [calvinlee-326.com](https://www.calvinlee-326.com).

## Features

- `/`: one-page portfolio; the "Real work" rail is pulled live from the GitHub API (refreshed hourly, ranked by my own latest push)
- `/terminal`: scroll-driven 3D "dev terminal" (three.js) with a static fallback
- Contact form (Resend) with Upstash Redis rate limiting, view counter, Spotify now-playing, ⌘K command palette

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS, Framer Motion, React Three Fiber
- Upstash Redis, Resend, Vercel Analytics

## Environment

All optional; each feature degrades gracefully without its keys.

- `GITHUB_TOKEN`: raises the GitHub API rate limit
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`: contact form
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: rate limiting and view counter
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`: now playing

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

