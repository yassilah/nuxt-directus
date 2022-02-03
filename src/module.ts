import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin } from '@nuxt/kit'

export interface DirectusOptions {
  api: string
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    directus: {
      api: string
    }
  }
}

export default defineNuxtModule<DirectusOptions>({
  meta: {
    name: '@nuxt-modules/directus',
    configKey: 'directus'
  },
  defaults: {
    api: 'http://localhost:8055'
  },
  setup (options, nuxt) {
    nuxt.options.publicRuntimeConfig.directus = {
      api: options.api
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, 'plugin'))

    nuxt.hook('autoImports:dirs', (autoImports) => {
      autoImports.push(resolve(__dirname, 'composables'))
    })
  }
})
