<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white">
    <h1 class="text-6xl font-bold mb-4">
      {{ props.error?.statusCode }}
    </h1>
    <p class="text-xl mb-8 text-gray-600 dark:text-gray-500">
      {{ props.error?.message }}
    </p>
    <NuxtLink to="/" class="px-6 py-3 bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black rounded-lg transition-colors">
      Go back home
    </NuxtLink>
  </div>
</template>
