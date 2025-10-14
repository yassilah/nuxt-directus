<script setup lang="ts">
import { readItems } from '@directus/sdk'

const { data } = useFetch('/api/rest')

const { error: errorClient } = await useAsyncData(async () => {
  const directus = useDirectusRest()
  const data = await directus.request(readItems('projects'))
  return data
}, { server: false })
</script>

<template>
  <h1>{{ data?.[0]?.name }}</h1>
  <div v-if="errorClient">
    Error from client
  </div>
</template>
