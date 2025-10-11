import { NAME } from '../../constants'
import { createDirectus, rest, staticToken } from '@directus/sdk'
import { useRuntimeConfig } from 'nitropack/runtime'

/**
 * Create a directus instance.
 */
export function useDirectus() {
    const { directusURL, accessToken } = useRuntimeConfig()[NAME]
    return createDirectus(directusURL).with(rest()).with(staticToken(accessToken))

}