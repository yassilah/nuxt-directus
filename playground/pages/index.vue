<script setup lang="ts">
const { data } = await useFetch('/api/items/projects/1')
</script>

<template>
  <div class="grid place-items-center h-screen">
    <p>Coming soon...</p>
    <pre>{{ data }}</pre>
    <p>{{ $t('test') }}</p>
  </div>
</template>
