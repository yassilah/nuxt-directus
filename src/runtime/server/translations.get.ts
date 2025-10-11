import { defineEventHandler } from 'h3'
import { readTranslations, type DirectusTranslation } from '@directus/sdk'
import { useDirectus } from './directus'

export default defineEventHandler((event) => {
    const { locale } = getQuery(event)

    return useDirectus().request(readTranslations({
         limit: -1,
         filter: locale ? {
            _or: [{
                language: { _eq: locale }
            }, {
                language: { _starts_with: locale + '-' }
            }]
         } : {},
    })) as Promise<DirectusTranslation[]>
})