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
}

module.exports = nextConfig
