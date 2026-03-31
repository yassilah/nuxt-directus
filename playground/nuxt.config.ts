export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '../src/module'],
  devtools: { enabled: true },
  directus: {
    url: 'https://demo.directus.io',
    accessToken: 'demo',
  },
  i18n: {
    locales: ['en-GB', 'fr-FR'],
    defaultLocale: 'en-GB',
  },
})
