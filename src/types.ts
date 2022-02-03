import type { ID, PartialItem, TypeMap, TypeOf } from '@directus/sdk'
import type { Ref } from 'vue'
declare module '@nuxt-modules/directus' {
    export interface CollectionTypes { }
    export type GenericCollectionTypes = TypeMap & CollectionTypes
    export type CollectionNames = {
        [K in keyof CollectionTypes]: CollectionTypes[K] extends any ? K : never
    }[keyof CollectionTypes]
    export type Item<N extends CollectionNames> = PartialItem<TypeOf<GenericCollectionTypes, N>>
    export type Collection<N extends CollectionNames> = Item<N>[]
}

export type ReactiveArg<T> = T|(() => T)|Ref<T>
