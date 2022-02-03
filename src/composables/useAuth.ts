import { AuthCredentials, PartialItem, RoleItem, UserItem } from '@directus/sdk'
import { createSharedComposable } from './../utils/composables'

/**
 * Use Directus auth.
 */
export const useAuth = createSharedComposable(() => {
  const directus = useDirectus()

  const loggingIn = ref(false)

  const refreshing = ref(false)

  const loggingOut = ref(false)

  const loading = computed(() => {
    return loggingIn.value || loggingOut.value || refreshing.value
  })

  const user = ref<PartialItem<UserItem>>()

  const role = ref<RoleItem>()

  const authenticated = computed(() => {
    return !!user.value
  })

  async function login (credentials: AuthCredentials) {
    try {
      loggingIn.value = true
      await directus.auth.login(credentials)
      await setUser()
    } catch (e) {
      unsetUser()
      console.error(e)
    } finally {
      loggingIn.value = false
    }

    return user.value
  }

  async function refresh () {
    try {
      refreshing.value = true
      await directus.auth.refresh()
      await setUser()
    } catch (e) {
      unsetUser()
      console.error(e)
    } finally {
      refreshing.value = false
    }

    return user.value
  }

  async function logout () {
    try {
      loggingOut.value = true
      await directus.auth.logout()
    } catch (e) {
      console.error(e)
    } finally {
      unsetUser()
      loggingOut.value = false
    }

    return user.value
  }

  async function setUser () {
    user.value = await directus.users.me.read()
    role.value = await directus.roles.readOne(user.value.role)
  }

  function unsetUser () {
    user.value = undefined
  }

  async function check () {
    if (directus.auth.token) {
      try {
        await setUser()
      } catch {
        await refresh()
      }
    }
  }

  return { user, authenticated, login, logout, loggingOut, loggingIn, loading, refreshing, refresh, check, role }
})
