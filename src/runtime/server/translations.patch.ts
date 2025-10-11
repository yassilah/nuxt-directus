import { defineEventHandler } from 'h3'
import { updateTranslationsBatch, deleteTranslations, createTranslations } from '@directus/sdk'
import { useDirectus } from './directus'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
    const { update, remove, create } = await readBody(event)
    const directus = useDirectus()

    if (update && update.length > 0) {
        await directus.request(updateTranslationsBatch(update))
    }
    

    if (remove && remove.length > 0) {
        await directus.request(deleteTranslations(remove))
    }
    
    if (create && create.length > 0) {
        await directus.request(createTranslations(create))
    }

    return { success: true }
})  