import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  directus: {
    url: 'http://localhost:8055',
    accessToken: 'test-token',
    proxy: { path: '/api/proxy' },
  },
})
