// Shared site content — consumed by both the classic site (/) and the 3D experience (/terminal).

export const NAME = 'Chun-Cheng Lee'
export const LOCATION = 'Los Angeles, CA'
export const LANGUAGES = ['English', 'Mandarin', 'Taiwanese']
export const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
export const GITHUB_USER = 'calvinlee326'
export const RESUME_URL = 'https://drive.google.com/file/d/1IdgzCeSSrZgQ_iYf0er2amxe0KF3zIhl/view?usp=sharing'
export const EMAIL = 'chunchenglee@outlook.com'
export const INSTAGRAM = 'https://instagram.com/calvinlee326'
export const SITE_URL = 'https://www.calvinlee-326.com'
export const BIO = 'Backend-focused SWE who builds APIs, AI integrations, and payment systems. Passionate about clean architecture and shipping products that work. Open to full-time backend or full-stack roles.'

export const SKILLS: Record<string, string[]> = {
  'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Java', 'Kotlin'],
  'Backend & Data': ['Django', 'Django REST Framework', 'FastAPI', 'Flask', 'Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'REST API Design', 'JWT Authentication', 'Google OAuth'],
  'Frontend': ['React', 'HTML/CSS', 'Bootstrap', 'Chrome Extension APIs (MV3)'],
  'AI & LLMs': ['Claude API (streaming, tool use)', 'OpenAI GPT-4o and Vision', 'RAG with Chroma', 'MCP servers', 'SSE streaming', 'Prompt engineering', 'Claude Code', 'Cursor', 'GitHub Copilot'],
  'Payments': ['Stripe API', 'Subscription Billing', 'Invoice Automation', 'Webhook Event Processing'],
  'Testing & DevOps': ['Unit Testing', 'Integration Testing', 'Test Automation', 'GitHub Actions (CI/CD)', 'Docker', 'Linux', 'Git', 'Heroku', 'Jira'],
}

// Pinned to the front of the project list, in this order; the rest follow by
// latest push. Also the offline fallback when GitHub is unreachable.
export const FEATURED = [
  'settlo',
  'code-review-memory',
  'h1b-sponsor-mcp',
  'codex-hud',
  'api-contract-drift-detector',
  'h1b-job-scraper',
]

export const REPO_DESCRIPTIONS: Record<string, string> = {
  'settlo': 'Bill-splitting PWA for groups and friends. Settles who owes whom in the fewest transactions, across seven currencies with each expense locked to that day\'s rate. FastAPI, PostgreSQL, React, Google sign-in.',
  'code-review-memory': 'AI code-review service for GitHub pull requests. A plan-then-audit LLM pipeline streams its progress over SSE and remembers your team\'s style rules across reviews.',
  'h1b-sponsor-mcp': 'MCP server that lets an AI assistant query USCIS H-1B employer data: a company\'s sponsorship history, or the largest sponsors in a given state.',
  'codex-hud': 'Terminal HUD and usage dashboard for the OpenAI Codex CLI, published on npm. Local-first: reads only metadata Codex already writes and makes no network calls.',
  'api-contract-drift-detector': 'CLI that diffs two OpenAPI specs and classifies every change as breaking, non-breaking, or a warning, so API regressions are caught before deploy.',
  'h1b-job-scraper': 'Scrapes ~2,000 H1B-sponsoring companies daily on GitHub Actions, flags salary anomalies by z-score, and ranks companies by salary and visa volume.',
  'palm-reading-app': 'AI-powered palm reading web app using GPT-4o Vision. Upload a palm photo and get personality, love & fortune analysis. Built with FastAPI + Next.js.',
  'summary-extension': 'Chrome extension that summarizes selected text using GPT via a secure backend API. Right-click any text → instant AI summary.',
  'aiagent': 'Collection of AI agent workflow patterns using OpenAI GPT — structured outputs, tool calling, prompt chaining, and external API integration.',
  'component-claude': 'AI-powered React component generator (UIGen) with live preview. Describe a UI and get working React code instantly via Claude API.',
  'socket-io-demo': 'Real-time chat app built with Socket.IO featuring instant messaging, message persistence, and multi-client support.',
  'password-generator': 'Browser-based password generator with customizable length, character sets, and one-click copy. Pure HTML/CSS/JS, no dependencies.',
  'blackjack': 'Casino-style Blackjack game playable in the browser. Hit, stand, and try to reach 21 without busting.',
  'scoreboard': 'Live basketball scoreboard — track home/guest scores, add 1/2/3 points, and manually edit scores. No build step required.',
  'portfolio-website': 'This portfolio. Next.js, Tailwind CSS, Framer Motion, three.js, Upstash Redis, and the Resend email API.',
}

export const LIVE_DEMOS: Record<string, string> = {
  'settlo': 'https://settlo-sooty.vercel.app',
  'code-review-memory': 'https://code-review-memory.onrender.com/api/',
  'blackjack': 'https://bbblackjack.netlify.app/',
  'scoreboard': 'https://cosmic-praline-3c086a.netlify.app',
  'palm-reading-app': 'https://palm-reading-app-iota.vercel.app',
}

export interface ShowcaseItem {
  title: string
  desc: string
  tags: string[]
}

export const SHOWCASE: ShowcaseItem[] = [
  {
    title: 'Backend & APIs',
    desc: 'Django, FastAPI, and Node services with clean REST design, JWT auth, and PostgreSQL behind every endpoint.',
    tags: ['Django', 'FastAPI', 'PostgreSQL', 'REST'],
  },
  {
    title: 'AI Integration',
    desc: 'GPT-4o Vision apps, RAG chatbots with multi-turn memory, and LLM-augmented workflows shipped to production.',
    tags: ['GPT-4o', 'RAG', 'LangChain', 'Claude API'],
  },
  {
    title: 'Payments & QA',
    desc: 'Stripe subscription billing, webhook event processing, and end-to-end test automation that keeps releases safe.',
    tags: ['Stripe', 'Webhooks', 'CI/CD', 'Test Automation'],
  },
]

export const RESUME_SUMMARY: { label: string; desc: string }[] = [
  { label: 'Backend Engineering', desc: 'Python (Django, FastAPI), PostgreSQL, REST APIs, Docker, and GitHub Actions CI/CD.' },
  { label: 'AI Integration', desc: 'GPT-4o Vision multimodal apps, prompt engineering, OpenAI API, LangChain workflows.' },
  { label: 'AI Chatbot', desc: 'Full-stack AI chatbot with GPT-4o-mini, RAG via ChromaDB, multi-turn memory, JWT auth, follow-up suggestions, and a resizable widget.' },
  { label: 'Payments & Quality', desc: 'Stripe payment systems, end-to-end QA automation, test-driven development mindset.' },
]

export interface Job {
  role: string
  company: string
  period: string
  points: string[]
}

// Company repos are private, so these are descriptions only, no links.
export const EXPERIENCE: Job[] = [
  {
    role: 'Software Developer',
    company: 'AtSquareOne',
    period: 'Apr 2024 – Present',
    points: [
      'Built a guardrailed AI agent for the member chat on atsquareone.org: four filter layers, 10 tools over live data with default-deny grants per app, and a signed two-step confirm so the model never writes data on its own.',
      'Split the agent into a standalone service the main site reaches over an internal API, covered by 86 offline tests and an 18-case golden set run against the real model.',
      'Own the Stripe billing backend in Django REST Framework: subscriptions, invoices, donations, and course payments, handled through webhooks across six Stripe event types, with prices resolved at runtime by lookup key.',
      'Built the earlier RAG chatbot (OpenAI, Chroma) with multilingual intent classification, an H-1B sponsor database from USCIS data, and a visa deadline tracker with reminders.',
    ],
  },
  {
    role: 'Web Developer (volunteer, part-time)',
    company: 'Incluvie',
    period: 'Jun 2026 – Sep 2026',
    points: [
      'Cut the JavaScript bundle 78% (2.8 MB to 610 KB) and image payload 54% after finding webpack was shipping development builds to production.',
      'Traced a post-deploy outage to Terser mangling a redis-om class name the library derives its search index from, and fixed it by leaving the server bundle unminified.',
      'Fixed /articles taking about 20 seconds: the Redis search index was being evicted from a 30 MB instance, so article bodies moved to their own evictable keys. Server rendering falls back to MySQL when Redis is down.',
      'Built actor and director pages end to end on the TMDB API, with server-side rendering and Redis caching.',
    ],
  },
  {
    role: 'Graduate Research Assistant',
    company: 'Cal Poly Pomona',
    period: 'Feb 2023 – Dec 2023',
    points: [
      'Developed an autonomous driving system on the Quanser QCar platform, with CNN-based real-time object detection across multiple camera feeds.',
      'Tuned PID controllers and real-time parameters, cutting measured control latency from 500 ms to 100 ms in lab benchmarks.',
      'Built path planning that combines obstacle avoidance, target tracking, and route optimization. Co-authored two academic papers.',
    ],
  },
  {
    role: 'Software QA Engineer',
    company: 'ViewSonic',
    period: 'Aug 2021 – Dec 2021',
    points: [
      'Designed and ran automated and manual test cases for ViewBoard display software on Windows, Android, ChromeOS, macOS, and iOS, escalating defects through Jira.',
      'Wrote QA workflow documentation and test plan templates the team adopted as standard references, working inside cross-functional Scrum teams.',
    ],
  },
  {
    role: 'Firmware QA Assistant Engineer',
    company: 'Synaptics',
    period: 'Mar 2021 – Apr 2021',
    points: [
      'Ran cross-platform test scenarios for touchpad firmware on HP, Dell, and Lenovo hardware, documenting failure modes for the firmware team.',
    ],
  },
  {
    role: 'Summer Intern, programming and marketing',
    company: 'Chunghwa International Communication Network',
    period: 'Jul 2017 – Sep 2017',
    points: [
      'Worked on e-payment integrations (SMS, PayPal, convenience-store, QR code, and phone-bill payments) and kept the payment system running.',
    ],
  },
]

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
  homepage: string | null
}

// How many repos the project rail and the terminal list show.
export const REPO_LIMIT = 9

// A curated demo wins; otherwise the repo's GitHub "Website" field.
export function demoUrl(repo: GitHubRepo): string | null {
  return LIVE_DEMOS[repo.name] ?? repo.homepage
}
