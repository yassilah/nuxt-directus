/**
 * Use Directus.
 */
export function useDirectus () {
  const { $directus } = useNuxtApp()

  return $directus
}
