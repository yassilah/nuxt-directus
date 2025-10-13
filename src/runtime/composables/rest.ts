import { rest } from '@directus/sdk'
import { createBaseDirectus } from '../helpers'

/**
 * Use directus (rest)
 */
export function useDirectus() {
  return createBaseDirectus().with(rest())
}
