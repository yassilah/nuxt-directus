// @ts-expect-error - @nuxtjs/i18n may not be installed.
import { defineI18nLocale } from '#i18n'
import { getI18nTranslations } from '../client'

/**
 * Define the i18n locale loader.
 */
export default defineI18nLocale((locale: string) => {
  return getI18nTranslations(locale)
})
