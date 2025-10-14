import { setup, url, createPage, waitForHydration } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

describe('client only', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    nuxtConfig: {
      directus: { composables: { server: false } },
    },
  })

  it('should work with proxy (useAsyncData)', async () => {
    const path = url('/proxy/use-async')
    const page = await createPage(path)
    await waitForHydration(page, path)
    expect(await page.getByText('Project 1').all()).toHaveLength(1)
  })

  it('should work with proxy (useFetch)', async () => {
    const path = url('/proxy/use-fetch')
    const page = await createPage(path)
    await waitForHydration(page, path)
    expect(await page.getByText('Project 1').all()).toHaveLength(1)
  })

  it('should work with directus composable (rest)', async () => {
    const path = url('/composables/rest/only-client')
    const page = await createPage(path)
    await waitForHydration(page, path)
    expect(await page.getByText('Project 1').all()).toHaveLength(1)
    expect(await page.getByText('Error from server').all()).toHaveLength(1)
  })

  it('should work with directus composable (graphql)', async () => {
    const path = url('/composables/graphql/only-client')
    const page = await createPage(path)
    await waitForHydration(page, path)
    expect(await page.getByText('Project 1').all()).toHaveLength(1)
    expect(await page.getByText('Error from server').all()).toHaveLength(1)
  })
})
