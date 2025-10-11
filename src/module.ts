import { addServerHandler, createResolver, defineNuxtModule, extendPages, installModules, updateRuntimeConfig } from 'nuxt/kit'
import { addCustomTab } from '@nuxt/devtools-kit'
import { ENDPOINT, NAME } from './constants'
import type { LocaleObject } from '@nuxtjs/i18n'
import { defu } from 'defu'

interface Options {
  url?: string
  accessToken?: string
}

export default defineNuxtModule<Options>({
  moduleDependencies: {
    '@nuxtjs/i18n': {
      version: '^10.0.0',
      optional: false,
    },
  },
  defaults: nuxt => defu(nuxt.options.i18n?.directus, {
    url: process.env.DIRECTUS_URL ?? nuxt.options.runtimeConfig.directusURL?.toString() ?? 'http://localhost:8055',
    accessToken: process.env.DIRECTUS_ACCESS_TOKEN ?? '',
  }),
  async setup(options, nuxt) {
    if (!options.accessToken || !options.url) {
      console.error(`[${NAME}] Please provide both 'url' and 'accessToken' options.`)
    }

    nuxt.options.typescript.hoist ??= []
    nuxt.options.typescript.hoist.push('@directus/sdk')

    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      route: ENDPOINT,
      method: 'get',
      handler: resolve('./runtime/server/translations.get'),
    })

    nuxt.hook('i18n:registerModule', (register) => {
      const locales = (nuxt.options.i18n?.locales || []).map((locale) => {
        const code = typeof locale === 'string' ? locale : locale.code
        return {
          code,
          file: 'index.ts',
        } as LocaleObject
      })

      register({ langDir: resolve('./runtime/lang'), locales })
    })

    updateRuntimeConfig({
      [NAME]: {
        directusURL: options.url,
        accessToken: options.accessToken,
      },
    })

    if (nuxt.options.devtools) {
      nuxt.options.pages = true

      extendPages((pages) => {
        pages.push({
          name: NAME,
          path: '/__directus',
          file: resolve('./runtime/pages/index.vue'),
          mode: 'client',
        })
      })

      addCustomTab({
        name: NAME,
        title: NAME,
        icon: 'heroicons-outline:globe-alt',
        view: {
          type: 'iframe',
          src: '/__directus',
        },
      })

      addServerHandler({
        route: ENDPOINT,
        method: 'patch',
        handler: resolve('./runtime/server/translations.patch'),
      })
    }
  },
})
