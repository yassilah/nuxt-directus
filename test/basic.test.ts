import { setup, url, createPage, waitForHydration } from '@nuxt/test-utils/e2e'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

describe('basic', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
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
    const path = url('/composables/rest/both')
    const page = await createPage(path)
    await waitForHydration(page, path)
    expect(await page.getByText('Project 1').all()).toHaveLength(2)
  })

  it('should work with directus composable (graphql)', async () => {
    const path = url('/composables/graphql/both')
    const page = await createPage(path)
    await waitForHydration(page, path)
    expect(await page.getByText('Project 1').all()).toHaveLength(2)
  })

  it.each([{
    code: 'en-US',
    path: '/i18n',
    value: 'Hello',
  }, {
    code: 'fr-FR',
    path: '/fr-FR/i18n',
    value: 'Bonjour',
  }])('should work with i18n module ($code)', async ({ code, value, path }) => {
    const page = await createPage(url(path))
    await waitForHydration(page, url(path))

    const filePath = fileURLToPath(new URL('./fixtures/basic/.nuxt/directus/locales/' + code + '.json', import.meta.url))
    expect(JSON.parse(readFileSync(filePath, 'utf-8'))).toMatchObject({ hello: value })

    expect(await page.getByText('Locale: ' + code).all()).toHaveLength(1)
    expect(await page.getByText(value).all()).toHaveLength(1)
  })
})
