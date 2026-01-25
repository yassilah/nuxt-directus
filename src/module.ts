import { hasNuxtModule, createResolver, defineNuxtModule, updateRuntimeConfig, useLogger, addTypeTemplate, addTemplate, addImports, addServerImports, addImportsDir, addServerImportsDir } from 'nuxt/kit'
import type { NuxtI18nOptions } from '@nuxtjs/i18n'
import type { ModuleOptions as ImageOptions } from '@nuxt/image'
import type { Nuxt } from 'nuxt/schema'
import { generateDirectusTypes } from 'directus-sdk-typegen'
import { withoutTrailingSlash, joinURL } from 'ufo'
import type { ConsolaInstance } from 'consola'
import type { ProxyOptions } from 'h3'
import { defu } from 'defu'
import { fetchTranslations, syncTranslations } from './runtime/server'
import { existsSync, readFileSync } from 'node:fs'
import { NAME } from './runtime/constants'
import { join } from 'node:path'
import chokidar from 'chokidar'

interface ModuleOptions {
  url?: string
  accessToken?: string
  composables?: false | { enabled?: boolean, mode?: 'graphql' | 'rest', client?: boolean, server?: boolean }
  i18n?: false | { enabled?: boolean, sync?: boolean, prefix?: string }
  types?: false | { enabled?: boolean }
  proxy?: false | { enabled?: boolean, path?: string, options?: ProxyOptions }
  image?: false | { enabled?: boolean, alias?: string }
}

type Config = ReturnType<typeof normalizeConfig>

export default defineNuxtModule<ModuleOptions>({
  meta: { name: NAME },
  setup(options, nuxt) {
    const logger = useLogger(NAME)
    const config = normalizeConfig(options)

    if (!config.accessToken || !config.url) {
      logger.error(`Please provide both 'url' and 'accessToken' options.`)
    }

    nuxt.options.typescript.hoist ??= []
    nuxt.options.typescript.hoist.push('@directus/sdk')

    updateRuntimeConfig({
      [NAME]: {
        url: config.url,
        accessToken: config.accessToken,
        i18nPrefix: config.i18n.prefix,
      },
      public: {
        [NAME]: {
          url: config.proxy.enabled ? config.proxy.path : config.composables.client ? config.url : undefined,
          i18nPrefix: config.i18n.prefix,
        },
      },
    })

    if (config.types.enabled) {
      setupTypes(config, nuxt, logger)
    }

    if (config.composables.enabled) {
      setupComposables(config, nuxt, logger)
    }

    if (config.i18n.enabled) {
      if (!hasNuxtModule('@nuxtjs/i18n')) return logger.error('@nuxtjs/i18n is not installed! Please install it to use the i18n features of this module.')

      setupI18n(config, nuxt, logger)
    }

    if (config.proxy.enabled) {
      setupProxy(config, nuxt, logger)
    }

    if (config.image.enabled) {
      if (!hasNuxtModule('@nuxt/image')) return logger.error('@nuxt/image is not installed! Please install it to use the image features of this module.')

      setupImage(config, nuxt, logger)
    }
  },
})

/**
 * Normalize module config
 */
function normalizeConfig(options: ModuleOptions) {
  return defu({
    url: options.url,
    accessToken: options.accessToken,
    i18n: options.i18n === false ? { enabled: false } : options.i18n,
    types: options.types === false ? { enabled: false } : options.types,
    proxy: options.proxy === false ? { enabled: false } : options.proxy,
    image: options.image === false ? { enabled: false } : options.image,
    composables: options.composables === false ? { enabled: false } : options.composables,
  }, {
    url: process.env.DIRECTUS_URL ?? 'http://localhost:8055',
    accessToken: process.env.DIRECTUS_ACCESS_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN || '',
    i18n: { enabled: hasNuxtModule('@nuxtjs/i18n'), sync: true, prefix: undefined },
    types: { enabled: true },
    proxy: { enabled: true, path: '/api', options: {} },
    image: { enabled: hasNuxtModule('@nuxt/image'), alias: 'directus' },
    composables: { enabled: true, mode: 'rest', client: true, server: true },
  })
}

/**
 * Setup composables
 */
function setupComposables(config: Config, nuxt: Nuxt, logger: ConsolaInstance) {
  const { resolve } = createResolver(import.meta.url)

  const path = resolve(`./runtime/composables`)

  const name = config.composables.mode === 'graphql' ? 'useDirectusGraphql' : 'useDirectusRest'

  const mainImport = {
    name,
    as: 'useDirectus',
    from: join(path, 'useDirectus'),
  }

  if (config.composables.client) {
    addImportsDir(path)
    addImports(mainImport)
  }

  if (config.composables.server) {
    addServerImportsDir(path)
    addServerImports(mainImport)
  }

  logger.info(`Composables have been registered (mode: ${config.composables.mode}).`)
}

/**
 * Setup i18n integration
 */
function setupI18n(config: Config, nuxt: Nuxt & { options: { i18n?: NuxtI18nOptions } }, logger: ConsolaInstance) {
  const { resolve } = createResolver(import.meta.url)

  const codes = (nuxt.options.i18n?.locales || []).map(locale => typeof locale === 'string' ? locale : locale.code)
  if (!codes.length) return

  if (config.i18n.sync) {
    const runtimeConfig = {
      url: config.url,
      accessToken: config.accessToken,
      i18nPrefix: config.i18n.prefix,
    }

    const path = 'directus/locales'

    const result = codes.map((code) => {
      const { filename } = addTemplate({
        write: true,
        filename: join(path, `${code}.json`),
        getContents: () => fetchTranslations(code, runtimeConfig).then((translations) => {
          return JSON.stringify(Object.fromEntries(translations.map(translation => [translation.key, translation.value])), null, 2)
        }),
      })

      return { code, filename }
    })

    if (nuxt.options.dev && !nuxt.options._prepare) {
      const watcher = chokidar.watch(path, { cwd: nuxt.options.buildDir, ignoreInitial: true })

      watcher.on('change', async (filePath) => {
        const code = result.find(i => i.filename === filePath)?.code
        if (!code) return
        const translations = JSON.parse(readFileSync(resolve(nuxt.options.buildDir, filePath), 'utf-8'))
        const done = await syncTranslations(code, translations, runtimeConfig)
        if (!done) return
        logger.info(`Synced translations for locale: ${code}`)
      })
    }
  }

  nuxt.hook('i18n:registerModule', (register) => {
    const isStubbing = existsSync(resolve('./runtime/lang/index.ts'))

    const locales = codes.map(code => ({
      code,
      file: isStubbing ? 'index.ts' : 'index.js',
    }))

    register({ langDir: resolve('./runtime/lang'), locales })

    logger.success('Locales have been registered: ' + codes.join(', '))
  })
}

/**
 * Setup types generation
 */
async function setupTypes(config: Config, nuxt: Nuxt, logger: ConsolaInstance) {
  addTypeTemplate({
    filename: 'directus/types.d.ts',
    getContents: () => generateDirectusTypes({
      directusUrl: withoutTrailingSlash(config.url),
      outputPath: '',
      directusToken: config.accessToken,
    }),
  })

  nuxt.options.alias = defu(nuxt.options.alias, {
    '#directus/types': './directus/types.d.ts',
  })

  logger.info('Directus types have been generated.')
}

/**
 * Setup proxy
 */
function setupProxy(config: Config, nuxt: Nuxt, logger: ConsolaInstance) {
  nuxt.options.routeRules ??= {}
  nuxt.options.routeRules[joinURL(config.proxy.path, '**')] = {
    proxy: defu(config.proxy.options, {
      to: joinURL(config.url, '**'),
    }),
  }

  logger.info(`Proxy is enabled on path: ${config.proxy.path}`)
}

/**
 * Setup image integration
 */
function setupImage(config: Config, nuxt: Nuxt & { options: { image?: ImageOptions } }, logger: ConsolaInstance) {
  nuxt.options.image = defu(nuxt.options.image, {
    domains: [new URL(config.url).hostname],
    alias: {
      [config.image.alias]: joinURL(config.url, 'assets'),
    },
  })

  logger.info(`Image alias has been registered: ${config.image.alias} -> ${config.url}`)
}
