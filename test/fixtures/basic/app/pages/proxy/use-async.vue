<script setup lang="ts">
import { useAsyncData } from '#app'

const { data } = useAsyncData<{ data: { name: string }[] }>(() => {
  return $fetch('/api/proxy/items/projects')
})
</script>

<template>
  <h1>{{ data?.data?.[0]?.name }}</h1>
</template>
