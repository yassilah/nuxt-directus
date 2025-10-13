import { createDirectus, createTranslations, deleteTranslations, readTranslations, rest, staticToken, updateTranslationsBatch, type DirectusTranslation } from '@directus/sdk'

type Config = {
  url: string
  accessToken?: string
  i18nPrefix?: string
}

/**
 * Create a directus instance.
 */
function useDirectus(config: Config) {
  return createDirectus(config.url).with(rest()).with(staticToken(config.accessToken || ''))
}

/**
 * Fetch translations.
 */
export async function fetchTranslations(locale: string, config: Config) {
  const { i18nPrefix } = config

  const directus = useDirectus(config)

  return await directus.request(readTranslations({
    fields: ['key', 'value', 'id'],
    limit: -1,
    filter: { language: { _eq: locale }, ...(i18nPrefix ? { key: { _startsWith: i18nPrefix } } : {}) },
  })) as DirectusTranslation[]
}

/**
 * Update translations.
 */
export async function syncTranslations(locale: string, translations: Record<string, string>, config: Config) {
  const directus = useDirectus(config)
  const current = await fetchTranslations(locale, config)

  const payload = {
    create: [] as Partial<DirectusTranslation>[],
    update: [] as Partial<DirectusTranslation>[],
    remove: [] as DirectusTranslation['id'][],
  }

  for (const [key, value] of Object.entries(translations)) {
    const translation = current.find(t => t.key === key)
    if (!translation) {
      payload.create.push({ key, value, language: locale })
    }
    else if (translation.value !== value) {
      payload.update.push({ id: translation.id, value })
    }
  }

  for (const translation of current) {
    if (!translations[translation.key]) {
      payload.remove.push(translation.id)
    }
  }

  if (!payload.create.length && !payload.update.length && !payload.remove.length) {
    return false
  }

  return Promise.all([
    payload.update.length > 0 ? directus.request(updateTranslationsBatch(payload.update)) : null,
    payload.create.length > 0 ? directus.request(createTranslations(payload.create)) : null,
    payload.remove.length > 0 ? directus.request(deleteTranslations(payload.remove)) : null,
  ])
}
