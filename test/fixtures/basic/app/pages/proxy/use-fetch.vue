<script setup lang="ts">
import { useFetch } from '#app'

const { data } = useFetch<{ data: { name: string }[] }>('/directus/items/projects')
</script>

<template>
  <h1>{{ data?.data?.[0]?.name }}</h1>
</template>
