export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '../src/module'],
  devtools: { enabled: true },
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
    directus: {
      url: 'http://localhost:8055',
    },
  },
})
