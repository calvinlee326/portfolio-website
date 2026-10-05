import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-white px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="text-sm tabular-nums text-neutral-400">404</p>
        <h1 className="mt-4 text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tighter text-neutral-900">
          Page not found.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-neutral-600">
          This page does not exist. The portfolio is one click away.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center bg-neutral-900 px-7 text-sm font-medium text-white transition hover:bg-neutral-700 active:translate-y-px"
        >
          Back home
        </Link>
      </div>
    </main>
  )
}
