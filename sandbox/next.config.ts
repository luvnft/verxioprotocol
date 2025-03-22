import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Add protocol path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../protocol/src'),
      '@/lib': path.resolve(__dirname, '../protocol/src/lib'),
      '@/utils': path.resolve(__dirname, '../protocol/src/utils'),
      '@/types': path.resolve(__dirname, '../protocol/src/types')
    }

    // Handle protocol's path aliases
    config.resolve.modules = [
      path.resolve(__dirname, '../protocol/src'),
      'node_modules'
    ]

    // Ensure proper module resolution
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx']

    return config
  },
}

export default nextConfig
