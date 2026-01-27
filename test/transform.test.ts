import { setup } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

await setup({
  rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
})

describe('types transform', async () => {
  it('should apply transform rules to generated types', async () => {
    const typesPath = resolve(
      fileURLToPath(new URL('./fixtures/basic/.nuxt/directus/types.d.ts', import.meta.url)),
    )

    const types = readFileSync(typesPath, 'utf-8')

    // The test fixture should replace 'directus_files' with 'files'
    expect(types).toContain('files')
    expect(types).not.toContain('directus_files')

    // The test fixture should replace 'directus_users' with 'users'
    expect(types).toContain('users')
    expect(types).not.toContain('directus_users')
  })
})
