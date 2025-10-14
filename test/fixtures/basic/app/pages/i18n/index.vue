<script setup lang="ts">
const { t, locale } = useI18n()
</script>

<template>
  <div>Locale: {{ locale }}</div>
  <div>{{ t('hello') }}</div>
</template>
