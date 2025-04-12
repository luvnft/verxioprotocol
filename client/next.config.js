/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'out',
  cleanDistDir: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  env: {
    PRISMA_FIELD_ENCRYPTION_KEY: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  },
}

module.exports = nextConfig
