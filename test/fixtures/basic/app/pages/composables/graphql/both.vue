<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const { data: dataServer } = useFetch('/api/graphql')

const { data: dataClient } = await useAsyncData(async () => {
  const directus = useDirectusGraphql()
  const data = await directus.query(`query {
    projects {
      id
      name
    }
  }`)
  return data
}, { server: false })
</script>

<template>
  <h1>{{ dataServer?.projects?.[0]?.name }}</h1>
  <h1>{{ dataClient?.projects?.[0]?.name }}</h1>
</template>
