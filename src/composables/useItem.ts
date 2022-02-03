import type { ID } from '@directus/sdk'
import type { Item, CollectionNames } from '@nuxt-modules/directus'
import type { Ref } from 'vue'
import defu from 'defu'
import type { ReactiveArg } from '../types'

interface UseCollectionItemsOptions<C extends boolean> {
  fetch?: boolean
  controls?: C
  watch?: boolean
}

/**
 * Use Directus collection items.
 */

export function useItem <N extends CollectionNames> (name: ReactiveArg<N>, id: ReactiveArg<ID>, options?: Partial<UseCollectionItemsOptions<false>>): Ref<Item<N>>
export function useItem <N extends CollectionNames> (name: ReactiveArg<N>, id: ReactiveArg<ID>, options?: Partial<UseCollectionItemsOptions<true>>): { item: Ref<Item<N>>, loading: Ref<boolean>, fetch: () => Promise<void> }
export function useItem <N extends CollectionNames> (name: ReactiveArg<N>, id: ReactiveArg<ID>, options?: UseCollectionItemsOptions<boolean>) {
  const _options = defu(options, { fetch: true, controls: false, watch: true })

  const collection = useCollection(name)

  const item = ref() as Ref<Item<N>>

  const loading = ref(false)

  const idValue = computed(() => {
    return typeof id === 'function' ? id() : unref(id)
  })

  async function fetch () {
    loading.value = true
    item.value = await collection.value.readOne(unref(idValue))
    loading.value = false
  }

  if (_options.fetch) {
    fetch()
  }

  if (_options.watch) {
    watchEffect(fetch)
  }

  if (_options.controls) {
    return { item, loading, fetch }
  }

  return item
}
