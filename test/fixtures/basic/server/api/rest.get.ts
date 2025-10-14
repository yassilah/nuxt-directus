import type { Project } from '#directus/types'
import { readItems } from '@directus/sdk'

/**
 * This is a server API route that uses the Directus GraphQL composable to fetch data from a Directus instance.
 */
export default defineEventHandler(async (event) => {
  try {
    const { useDirectusRest } = await import('#imports')

    const directus = useDirectusRest()

    return directus.request(readItems('projects')) as Promise<Project[]>
  }
  catch {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Error from server' }))
  }
})
