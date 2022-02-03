import { Directus } from '@directus/sdk'
import type { GenericCollectionTypes } from '@nuxt-modules/directus'

export default defineNuxtPlugin(() => ({
  provide: {
    directus: new Directus<GenericCollectionTypes>(useRuntimeConfig().directus.api)
  }
}))
