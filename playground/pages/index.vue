<script setup lang="ts">
import { login, readMe } from '@directus/sdk'

const directus = useDirectus()

async function handleLogin() {
  try {
    await directus.request(login({
      email: 'admin@example.com',
    }))
  }
  catch (error) {
    console.error('Login failed:', error)
  }
}

const { data: user } = useAsyncData('user', () => directus.request(readMe()))
</script>

<template>
  <div class="grid place-items-center h-screen">
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      @click="handleLogin"
    >
      Login
    </button>

    <pre>{{ user }}</pre>
  </div>
</template>
