import type { Item, Collection, CollectionNames } from '@nuxt-modules/directus'
import type { Ref, ComputedRef } from 'vue'
import defu from 'defu'
import type { IItems } from '@directus/sdk'
import type { ReactiveArg } from '../types'

interface UseCollectionItemsOptions<C extends boolean> {
  fetch?: boolean
  watch?: boolean
  controls?: C
}

/**
 * Use Directus collection items.
 */

export function useItems<N extends CollectionNames> (name: ReactiveArg<N>, options?: UseCollectionItemsOptions<false>): Ref<Collection<N>>
export function useItems <N extends CollectionNames> (name: ReactiveArg<N>, options?: UseCollectionItemsOptions<true>): { items: Ref<Collection<N>>, loading: Ref<boolean>, fetch: () => Promise<void>, collection: ComputedRef<IItems<Item<N>>> }
export function useItems <N extends CollectionNames> (name: ReactiveArg<N>, options?: UseCollectionItemsOptions<boolean>) {
  const _options = defu(options, { fetch: true, controls: false, watch: true })

  const collection = useCollection(name)

  const items = ref([]) as Ref<Collection<N>>

  const loading = ref(false)

  async function fetch () {
    loading.value = true
    const { data } = await collection.value.readMany()
    items.value = data
    loading.value = false
  }

  if (_options.fetch) {
    fetch()
  }

  if (_options.watch) {
    watchEffect(fetch)
  }

  if (_options.controls) {
    return { items, loading, fetch, collection }
  }

  return items
}
