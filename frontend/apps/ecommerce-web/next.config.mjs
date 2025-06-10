/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@leafyhealth/ui-kit',
    '@leafyhealth/api-client',
    '@leafyhealth/auth',
    '@leafyhealth/config',
    '@leafyhealth/utils'
  ],
  experimental: {
    externalDir: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig