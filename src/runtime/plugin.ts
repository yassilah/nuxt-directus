import { Directus } from '@directus/sdk'
import type { GenericCollectionTypes } from '@nuxt-modules/directus'
import type { RouteLocationNormalized } from 'vue-router'
import { withQuery } from 'ufo'

export default defineNuxtPlugin(() => {
  const { api, addGlobalAuthCheck, addMiddlewares, addRolesMiddleware } = useRuntimeConfig().directus

  if (addMiddlewares) {
    if (addGlobalAuthCheck) {
      addRouteMiddleware('auth:check', globalAuthCheck, { global: true })
    }

    addRouteMiddleware('auth', auth)

    if (addRolesMiddleware) {
      for (const role of addRolesMiddleware) {
        addRouteMiddleware(`auth:${role}`, authRole(role))
      }
    }
  }

  return {
    provide: {
      directus: new Directus<GenericCollectionTypes>(api)
    }
  }
})

/**
 * Auth check middleware: refresh existing user but does not prevent navigation.
 */
async function globalAuthCheck () {
  const { check } = useAuth()

  await check()
}

/**
 * Auth middleware: requires user to be authenticated.
 */
function auth (_to: RouteLocationNormalized, from: RouteLocationNormalized) {
  const { redirectAuthLogin } = useRuntimeConfig().directus
  const { authenticated } = useAuth()
  const router = useRouter()

  function redirectIfNotAuthenticated () {
    if (!authenticated.value) {
      return router.push(withQuery(redirectAuthLogin, { from: from.fullPath }))
    }
  }

  watch(authenticated, redirectIfNotAuthenticated)

  return redirectIfNotAuthenticated()
}

/**
 * Auth role middleware: requires user to be authenticated and have the given role.
 */
function authRole (roleName: string) {
  return (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    const { redirectAuthLogin } = useRuntimeConfig().directus
    const { role } = useAuth()
    const router = useRouter()
    const redirect = withQuery(redirectAuthLogin, { from: to.fullPath })

    function redirectIfNotAuthenticated () {
      if (role.value?.name.toLowerCase() !== roleName.toLowerCase()) {
        try {
          return navigateTo(redirect)
        } catch {
          return router.push(redirect)
        }
      }
    }

    watch(role, redirectIfNotAuthenticated)

    return redirectIfNotAuthenticated()
  }
}
