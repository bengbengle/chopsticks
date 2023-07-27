import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export default defineConfig({
  test: {
    hookTimeout: 5000000,
    testTimeout: 5000000,
    include: ['packages/**/*.test.ts'],
  },
  plugins: [swc.vite(), tsconfigPaths()],
})
