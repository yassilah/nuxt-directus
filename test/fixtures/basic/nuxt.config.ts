import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],
  directus: {
    url: 'http://localhost:8055',
    accessToken: 'test-token',
    proxy: { path: '/api/proxy' },
  },
  i18n: {
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
  },
})
