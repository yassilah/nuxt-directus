export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '../src/module'],
  devtools: { enabled: true },
  i18n: {
    locales: ['en-GB', 'fr-FR'],
    defaultLocale: 'en-GB',
  },
})
