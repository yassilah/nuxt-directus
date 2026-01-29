import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    retry: 2,
    globalSetup: ['./test/setup.ts'],
  },
})
