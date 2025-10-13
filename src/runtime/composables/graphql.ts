import { graphql } from '@directus/sdk'
import { createBaseDirectus } from './../client'

/**
 * Use directus (rest)
 */
export function useDirectus() {
  return createBaseDirectus().with(graphql())
}
