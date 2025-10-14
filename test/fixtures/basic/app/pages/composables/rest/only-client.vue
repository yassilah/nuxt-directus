<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { readItems } from '@directus/sdk'

const { error: errorServer } = useFetch<any>('/api/rest')

const { data } = await useAsyncData(async () => {
  const directus = useDirectusRest()
  const data = await directus.request(readItems('projects'))
  return data
}, { server: false })
</script>

<template>
  <h1>{{ data?.[0]?.name }}</h1>
  <div v-if="errorServer">
    Error from server
  </div>
</template>
