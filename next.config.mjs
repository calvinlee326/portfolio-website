/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers from MIME-sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer info sent to other sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable FLoC / interest-cohort tracking
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js App Router requires unsafe-inline for hydration scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Tailwind + Framer Motion use inline styles
              "style-src 'self' 'unsafe-inline'",
              // Allow images from anywhere (GitHub avatars, etc.) and data URIs
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              // Resume iframe is served from Google Drive
              "frame-src https://drive.google.com",
              // All API calls go through our own Next.js routes now
              "connect-src 'self'",
              "object-src 'none'",
              // Prevent this site from being embedded in iframes elsewhere
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
