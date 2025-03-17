import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 30000, // 30 seconds
    hookTimeout: 30000, // 30 seconds
    teardownTimeout: 30000, // 30 seconds
    environment: 'node',
    globals: true,
  },
})
