import { NAME } from '../module'
import { createDirectus } from '@directus/sdk'
import { parseHost, joinURL } from 'ufo'
import { createError, useRuntimeConfig } from '#imports'
import { fetchTranslations } from './server'
import type { Schema } from '#directus/types'
/**
 * Get runtime directus URL
 */
function getRuntimeConfig() {
  if (import.meta.server) return useRuntimeConfig()[NAME]

  const base = useRuntimeConfig().public[NAME]

  return {
    ...base,
    url: getRuntimeClientDirectusURL(base.url),
  }
}

/**
 * Get runtime directus URL
 */
function getRuntimeClientDirectusURL(path: string) {
  if (!path) throw new Error(`[${NAME}] No Directus URL provided for client.`)

  const hasHost = !!parseHost(path).hostname

  return hasHost ? path : joinURL(window.location.origin, path)
}

/**
 * Create base directus instance.
 */
export function createBaseDirectus() {
  const { url } = getRuntimeConfig()

  return createDirectus<Schema>(url, {
    globals: {
      fetch: $fetch.create({
        baseURL: url,
        onResponseError({ response }) {
          const [error] = response._data.errors || []
          if (!error) return
          throw createError({
            status: response.status,
            message: error.message,
          })
        },
      }),
    },
  })
}

/**
 * Get i18n translations.
 */
export async function getI18nTranslations(locale: string, config = getRuntimeConfig()) {
  const data = await fetchTranslations(locale, config)
  return Object.fromEntries(data.map(item => [item.key, item.value]))
}
