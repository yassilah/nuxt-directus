<script setup lang="ts">
import type { Project } from '#directus/types'

const { data } = useFetch('/api/graphql')

const { error: errorClient } = await useAsyncData(async () => {
  const directus = useDirectusGraphql()
  const data = await directus.query<{ projects: Project[] }>(`{
    projects {
      id
      name
    }
  }`)

  return data
}, { server: false })
</script>

<template>
  <h1>{{ data?.projects?.[0]?.name }}</h1>
  <div v-if="errorClient">
    Error from client
  </div>
</template>
