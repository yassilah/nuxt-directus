import { Directus } from '@directus/sdk'
import type { GenericCollectionTypes } from '@nuxt-modules/directus'

export default defineNuxtPlugin(() => {
  const { api } = useRuntimeConfig().directus

  return {
    provide: {
      directus: new Directus<GenericCollectionTypes>(api)
    }
  }
})
