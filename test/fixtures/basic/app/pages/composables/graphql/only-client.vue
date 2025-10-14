<script setup lang="ts">
import type { Project } from '#directus/types'

const { error: errorServer } = useFetch('/api/graphql')

const { data } = await useAsyncData(async () => {
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
  <div v-if="errorServer">
    Error from server
  </div>
</template>
