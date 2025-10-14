import type { Project } from '#directus/types'

/**
 * This is a server API route that uses the Directus GraphQL composable to fetch data from a Directus instance.
 */
export default defineEventHandler(async (event) => {
  try {
    const { useDirectusGraphql } = await import('#imports')

    const directus = useDirectusGraphql()

    const data = await directus.query<{ projects: Project[] }>(`{
        projects {
        id
        name
        }
    }`)

    return data
  }
  catch {
    sendError(event, createError({ statusCode: 500, statusMessage: 'Error from server' }))
  }
})
