// Shared site content — consumed by both the classic site (/) and the 3D experience (/terminal).

export const NAME = 'Chun-Cheng Lee'
export const LOCATION = 'Los Angeles, CA'
export const LANGUAGES = ['English', 'Mandarin', 'Taiwanese']
export const LINKEDIN = 'https://www.linkedin.com/in/chunchenglee326/'
export const GITHUB_USER = 'calvinlee326'
export const RESUME_URL = 'https://drive.google.com/file/d/1IdgzCeSSrZgQ_iYf0er2amxe0KF3zIhl/view?usp=sharing'
export const EMAIL = 'chunchenglee@outlook.com'
export const BIO = 'Backend-focused SWE who builds APIs, AI integrations, and payment systems. Passionate about clean architecture and shipping products that work. Open to full-time backend or full-stack roles.'

export const SKILLS: Record<string, string[]> = {
  'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Java', 'Kotlin'],
  'Backend & APIs': ['Django', 'Django REST Framework', 'Flask', 'Node.js', 'Express.js', 'REST API Design', 'Webhook Handling', 'JWT Authentication', 'Google OAuth'],
  'Frontend': ['React', 'HTML/CSS', 'Bootstrap', 'Chrome Extension APIs (MV3)'],
  'AI / LLM Integration': ['Claude Code', 'Cursor', 'AI-assisted IDE', 'GitHub Copilot', 'LLM-augmented development'],
  'Databases & Caching': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization'],
  'DevOps & Cloud': ['GitHub Actions (CI/CD)', 'Heroku', 'Linux', 'Git', 'Docker'],
  'Payments': ['Stripe API', 'Subscription Billing', 'Invoice Automation', 'Webhook Event Processing'],
  'Testing & QA': ['Unit Testing', 'Integration Testing', 'Test Automation', 'Test Case Design', 'Jira', 'Defect Tracking'],
  'AI Dev Tools': ['Claude Code', 'Cursor (AI-assisted IDE)', 'GitHub Copilot', 'Prompt Engineering', 'LLM-augmented development'],
  'Practices': ['Agile/Scrum', 'Code Review', 'API Security', 'Technical Documentation', 'Cross-Functional Collaboration'],
  'Currently Learning': ['AWS (EC2, S3, RDS)', 'System Design'],
}

export const LANG_COLORS: Record<string, string> = {
  Python: '#3776ab', JavaScript: '#f7df1e', TypeScript: '#3178c6',
  HTML: '#e34f26', CSS: '#1572b6', Go: '#00add8', Rust: '#dea584',
  Java: '#b07219', Ruby: '#701516', Swift: '#fa7343', Kotlin: '#a97bff',
  Shell: '#89e051', 'C++': '#f34b7d', C: '#555555',
}

export const REPO_DESCRIPTIONS: Record<string, string> = {
  'palm-reading-app': 'AI-powered palm reading web app using GPT-4o Vision. Upload a palm photo and get personality, love & fortune analysis. Built with FastAPI + Next.js.',
  'summary-extension': 'Chrome extension that summarizes selected text using GPT via a secure backend API. Right-click any text → instant AI summary.',
  'aiagent': 'Collection of AI agent workflow patterns using OpenAI GPT — structured outputs, tool calling, prompt chaining, and external API integration.',
  'component-claude': 'AI-powered React component generator (UIGen) with live preview. Describe a UI and get working React code instantly via Claude API.',
  'socket-io-demo': 'Real-time chat app built with Socket.IO featuring instant messaging, message persistence, and multi-client support.',
  'password-generator': 'Browser-based password generator with customizable length, character sets, and one-click copy. Pure HTML/CSS/JS, no dependencies.',
  'blackjack': 'Casino-style Blackjack game playable in the browser. Hit, stand, and try to reach 21 without busting.',
  'scoreboard': 'Live basketball scoreboard — track home/guest scores, add 1/2/3 points, and manually edit scores. No build step required.',
  'portfolio-website': 'This portfolio — built with Next.js, Tailwind CSS, Framer Motion, and the Resend email API.',
}

export const LIVE_DEMOS: Record<string, string> = {
  'blackjack': 'https://bbblackjack.netlify.app/',
  'scoreboard': 'https://cosmic-praline-3c086a.netlify.app',
  'palm-reading-app': 'https://palm-reading-app-iota.vercel.app',
}

export const ROLES = ['Software Engineer', 'Backend Developer', 'Quality Assurance', 'AI Enthusiast']

export interface ShowcaseItem {
  num: string
  title: string
  desc: string
  tags: string[]
  gradient: string
}

export const SHOWCASE: ShowcaseItem[] = [
  {
    num: '01',
    title: 'Backend & APIs',
    desc: 'Django, FastAPI, and Node services with clean REST design, JWT auth, and PostgreSQL behind every endpoint.',
    tags: ['Django', 'FastAPI', 'PostgreSQL', 'REST'],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    num: '02',
    title: 'AI Integration',
    desc: 'GPT-4o Vision apps, RAG chatbots with multi-turn memory, and LLM-augmented workflows shipped to production.',
    tags: ['GPT-4o', 'RAG', 'LangChain', 'Claude API'],
    gradient: 'from-cyan-400 to-emerald-400',
  },
  {
    num: '03',
    title: 'Payments & QA',
    desc: 'Stripe subscription billing, webhook event processing, and end-to-end test automation that keeps releases safe.',
    tags: ['Stripe', 'Webhooks', 'CI/CD', 'Test Automation'],
    gradient: 'from-emerald-400 to-blue-500',
  },
]

export const RESUME_SUMMARY: { label: string; desc: string }[] = [
  { label: 'Backend Engineering', desc: 'Python (Django, FastAPI), PostgreSQL, REST APIs, cloud deployments on AWS & Fly.io.' },
  { label: 'AI Integration', desc: 'GPT-4o Vision multimodal apps, prompt engineering, OpenAI API, LangChain workflows.' },
  { label: 'AI Chatbot', desc: 'Full-stack AI chatbot with GPT-4o-mini, RAG via ChromaDB, multi-turn memory, JWT auth, follow-up suggestions, and a resizable widget.' },
  { label: 'Payments & Quality', desc: 'Stripe payment systems, end-to-end QA automation, test-driven development mindset.' },
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
}

export function toDrivePreview(url: string): string {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const fileId = parts.find((p) => p && p.length > 20)
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url
  } catch (e) {
    console.error('[toDrivePreview] Failed to parse URL:', e)
    return url
  }
}
