import { NAME } from './constants'
import { authentication, createDirectus, staticToken } from '@directus/sdk'
import { parseHost, joinURL } from 'ufo'
import { createError, useCookie, useRuntimeConfig } from '#imports'
import { fetchTranslations } from './server'

// @ts-expect-error - types are not generated yet
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
  const { url, auth } = getRuntimeConfig()

  const instance = createDirectus<Schema>(url, {
    globals: {
      fetch: $fetch.create({
        async  onRequest({ options }) {
          if (!auth?.cookieName) return
          const token = useCookie(auth.cookieName).value

          if (token) {
            options.headers.set('Authorization', `Bearer ${token}`)
          }
        },
        async onResponse({ response, options, request }) {
          try {
            if (!auth?.cookieName) return

            if (request.toString().endsWith('/auth/login')) {
              const { mode } = JSON.parse(String(options.body))

              if (mode === 'cookie') {
                const { access_token, expires } = response._data.data

                useCookie(auth.cookieName, {
                  expires: expires ? new Date(Date.now() + expires * 1000) : undefined,
                }).value = access_token
              }
            }
          }
          catch (error) {
            console.error('Error handling response:', error)
          }
        },
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

  if (auth.mode === 'static') {
    instance.with(staticToken(auth.token))
  }
  else if (auth.mode === 'cookie') {
    instance.with(authentication('cookie', {
      autoRefresh: auth.autoRefresh,
      credentials: 'include',
    }))
  }
  else if (auth.mode === 'session') {
    instance.with(authentication('session', {
      autoRefresh: auth.autoRefresh,
      credentials: 'include',
    }))
  }

  return instance
}

/**
 * Get i18n translations.
 */
export async function getI18nTranslations(locale: string, config = getRuntimeConfig()) {
  const data = await fetchTranslations(locale, config)
  return Object.fromEntries(data.map(item => [item.key, item.value]))
}
