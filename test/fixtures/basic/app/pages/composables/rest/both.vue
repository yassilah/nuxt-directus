<script setup lang="ts">
import { readItems } from '@directus/sdk'

const { data: dataServer } = await useFetch('/api/rest')

const { data: dataClient } = await useAsyncData(async () => {
  const directus = useDirectusRest()
  const data = await directus.request(readItems('projects'))
  return data
}, { server: false })
</script>

<template>
  <h1>{{ dataServer?.[0]?.name }}</h1>
  <h1>{{ dataClient?.[0]?.name }}</h1>
</template>
