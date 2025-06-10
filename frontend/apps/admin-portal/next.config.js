/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  allowedDevOrigins: [
    'eca9ad71-b171-4084-9b21-fbb6be35bbdc-00-34jw1q1y5ys6q.janeway.replit.dev'
  ],
  images: {
    domains: ['localhost', 'api.leafyhealth.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8081',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8081/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig