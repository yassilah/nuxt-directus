import type { ID, PartialItem, TypeMap, TypeOf } from '@directus/sdk'
import type { Ref } from 'vue'
declare module '@nuxt-modules/directus' {
    export interface CollectionTypes {
        roles: {
            'id': string
            'name': string
            'icon': string
            'description': string|null,
            'ip_access': string|null,
            'enforce_tfa': boolean,
            'admin_access': boolean,
            'app_access': boolean,
            'users': ID[]
        }
     }
    export type GenericCollectionTypes = TypeMap & CollectionTypes
    export type CollectionNames = {
        [K in keyof CollectionTypes]: CollectionTypes[K] extends any ? K : never
    }[keyof CollectionTypes]
    export type Item<N extends CollectionNames> = PartialItem<TypeOf<GenericCollectionTypes, N>>
    export type Collection<N extends CollectionNames> = Item<N>[]
}

export type ReactiveArg<T> = T|(() => T)|Ref<T>
