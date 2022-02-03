import type { CollectionNames } from '@nuxt-modules/directus'
import type { ReactiveArg } from '../types'

/**
 * Use Directus collection.
 */
export function useCollection <N extends CollectionNames> (name: ReactiveArg<N>) {
  const directus = useDirectus()

  const collectionName = computed(() => {
    return typeof name === 'function' ? name() : unref(name)
  })

  const collection = computed(() => {
    return directus.items<N>(collectionName.value)
  })

  return collection
}
