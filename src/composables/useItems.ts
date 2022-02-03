import type { Item, Collection, CollectionNames } from '@nuxt-modules/directus'
import type { Ref, ComputedRef } from 'vue'
import defu from 'defu'
import type { IItems } from '@directus/sdk'
import type { ReactiveArg } from '../types'

interface UseCollectionItemsOptions<C extends boolean> {
  fetch?: boolean
  watch?: boolean
  controls?: C
  refreshOnAuthChanged?: boolean
}

/**
 * Use Directus collection items.
 */

export function useItems<N extends CollectionNames> (name: ReactiveArg<N>, options?: UseCollectionItemsOptions<false>): Ref<Collection<N>>
export function useItems <N extends CollectionNames> (name: ReactiveArg<N>, options?: UseCollectionItemsOptions<true>): { items: Ref<Collection<N>>, loading: Ref<boolean>, fetch: () => Promise<void>, collection: ComputedRef<IItems<Item<N>>>, error: Ref<string|null> }
export function useItems <N extends CollectionNames> (name: ReactiveArg<N>, options?: UseCollectionItemsOptions<boolean>) {
  const _options = defu(options, { fetch: true, controls: false, watch: true, refreshOnAuthChanged: true })

  const collection = useCollection(name)

  const items = ref([]) as Ref<Collection<N>>

  const loading = ref(false)

  const error = ref<string|null>(null)

  async function fetch () {
    try {
      error.value = null
      loading.value = true
      const { data } = await collection.value.readMany()
      items.value = data
    } catch (e) {
      items.value = []
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (_options.fetch) {
    fetch()
  }

  if (_options.watch) {
    watchEffect(fetch)
  }

  if (_options.refreshOnAuthChanged) {
    const { user } = useAuth()
    watch(user, fetch)
  }

  if (_options.controls) {
    return { items, loading, fetch, collection, error }
  }

  return items
}
