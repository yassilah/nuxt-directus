import { ENDPOINT } from '../../constants'

export default defineI18nLocale(async locale => {
    const raw = await $fetch(ENDPOINT, {  query: { locale }  })
    return Object.fromEntries(raw.map(item => [item.key, item.value]))
})