import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],
  directus: {
    url: 'http://localhost:8055',
    accessToken: 'SUPER_TOKEN',
    i18n: {
      sync: true,
    },
    types: {
      enabled: true,
      transform: [
        { from: /directus_files/g, to: 'files' },
        { from: /directus_users/g, to: 'users' },
      ],
    },
  },
  i18n: {
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
  },
})
