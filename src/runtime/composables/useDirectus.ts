import { rest, graphql } from '@directus/sdk'
import { createBaseDirectus } from './../client'

/**
 * Use directus (rest)
 */
export function useDirectusRest() {
  return createBaseDirectus().with(rest())
}

/**
 * Use directus (rest)
 */
export function useDirectusGraphql() {
  return createBaseDirectus().with(graphql())
}
