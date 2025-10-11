<script setup lang="ts">
import type { DirectusTranslation } from '@directus/sdk'
import { ENDPOINT } from '../../constants'
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/vue'
import type { Column, WorksheetInstance } from 'jspreadsheet-ce'
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

/**
 * Fetch the translations from Directus.
 */
const { data, pending, refresh } = await useFetch<DirectusTranslation[]>(ENDPOINT, {
  default: () => [],
})

/**
 * Columns.
 */
const columns = [
  { name: 'id', type: 'hidden' },
  { type: 'text', title: 'Key', name: 'key' },
  { type: 'text', title: 'Value', name: 'value' },
  { type: 'text', title: 'Language', name: 'language' },
] satisfies Column[]

/**
 * Reference to the spreadsheet.
 */
const spreadsheet = useTemplateRef('spreadsheet')

/**
 * Update Nuxt App messages.
 */
function updateMessages() {
  const nuxtApp = useDevtoolsClient().value?.host.nuxt
  if (!nuxtApp) return

  const { locale, loadLocaleMessages } = nuxtApp.$i18n
  loadLocaleMessages(toValue(locale))
}

/**
 * Current worksheet instance.
 */
const worksheet = computed(() => {
  return toValue(spreadsheet)?.current?.at(0) as WorksheetInstance
})

/**
 * Saving state.
 */
const saving = ref(false)

/**
 * Data as json.
 */
function getJSONData() {
  const newData = toValue(worksheet)?.getData()

  if (!newData) return []

  return newData.map(row => Object.fromEntries(row.map((cell, index) => [columns[index]?.name, cell || undefined])))
    .filter(row => row.value && row.language && row.key) as DirectusTranslation[]
}

/**
 * Get create data.
 */
function getCreateData(items: DirectusTranslation[]) {
  return items.filter(row => !row.id)
}

/**
 * Get update data.
 */
function getUpdateData(items: DirectusTranslation[]) {
  return items.filter(row => row.id).map((row) => {
    const original = toValue(data).find(r => r.id === row.id)

    if (!original) return row

    return {
      ...row,
      language: original.language === row.language ? undefined : row.language,
      key: original.key === row.key ? undefined : row.key,
    }
  })
}

/**
 * Get remove data.
 */
function getRemoveData(items: DirectusTranslation[]) {
  return toValue(data).filter(row => !items.find(r => r.id === row.id)).map(row => row.id) || []
}

/**
 * Save changes.
 */
async function save() {
  try {
    saving.value = true

    const json = getJSONData()

    await $fetch(ENDPOINT, {
      method: 'patch',
      body: {
        create: getCreateData(json),
        update: getUpdateData(json),
        remov: getRemoveData(json),
      },
    })

    await refresh()

    updateMessages()
  }
  catch (error) {
    console.error(error)
  }
  finally {
    saving.value = false
  }
}

watchEffect(() => {
  toValue(worksheet)?.setData(toValue(data) || [])
})
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <h1>Translations</h1>
      <div class="buttons">
        <button
          :data-loading="!saving && pending"
          class="refresh"
          @click="refresh()"
        >
          Refresh
        </button>
        <button
          :data-loading="saving"
          class="save"
          @click="save()"
        >
          Save
        </button>
      </div>
    </div>
    <Spreadsheet
      ref="spreadsheet"
      :allow-export="false"
    >
      <Worksheet :columns />
    </Spreadsheet>
  </div>
</template>

<style>
@import "jspreadsheet-ce/dist/jspreadsheet.css";
@import "jsuites/dist/jsuites.css";

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.wrapper {
    padding: 2rem 3rem;
    font-family: Arial, sans-serif;
    & .jss_worksheet {
        width: 100%;
        height: 100%;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .buttons {
            display: flex;
            gap: 0.5rem;
            button {
                padding: 0.5rem 1rem;
                font-size: 0.85rem;
                border: none;
                border-radius: 0.375rem;
                background-color: #3b82f6;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex-shrink: 0;
                &[data-loading=true] {
                    pointer-events: none;
                    &:before {
                        content: '';
                        border: 1px solid white;
                        border-top-color: transparent;
                        border-radius: 50%;
                        aspect-ratio: 1;
                        width: 1rem;
                        animation: spin 1s linear infinite;
                    }
                }
                &:hover {
                    background-color: #2563eb;
                }
                &.save {
                    background-color: #10b981;
                    &:hover {
                        background-color: #059669;
                    }
                }
            }
        }
    }
}
</style>
