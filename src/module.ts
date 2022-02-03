import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'

export interface DirectusOptions {
  api: string
  redirectAuthLogin: string
  addGlobalAuthCheck: boolean
  addMiddlewares: boolean
  addRolesMiddleware: string[]
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    directus: {
      api: string
      redirectAuthLogin: string
      addGlobalAuthCheck: boolean
      addMiddlewares: boolean
      addRolesMiddleware: string[]
    }
  }
}

export default defineNuxtModule<DirectusOptions>({
  meta: {
    name: '@nuxt-modules/directus',
    configKey: 'directus'
  },
  defaults: {
    api: 'http://localhost:8055',
    redirectAuthLogin: '/login',
    addGlobalAuthCheck: true,
    addMiddlewares: true,
    addRolesMiddleware: ['Administrator']
  },
  setup (options, nuxt) {
    nuxt.options.publicRuntimeConfig.directus = {
      api: options.api,
      redirectAuthLogin: options.redirectAuthLogin,
      addGlobalAuthCheck: true,
      addMiddlewares: true,
      addRolesMiddleware: options.addRolesMiddleware
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)
    addPlugin(resolve(runtimeDir, 'plugin'))

    nuxt.hook('autoImports:dirs', (autoImports) => {
      autoImports.push(resolve(__dirname, 'composables'))
    })
  }
})
