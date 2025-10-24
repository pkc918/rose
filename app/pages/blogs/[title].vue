<script setup lang="ts">
import { formatDate } from '~/utils/formatTime'

const route = useRoute()

// 获取具体的博客内容
const { data: blog } = await useAsyncData(route.path, () => {
  return queryCollection('blogs' as any)
    .path(route.path)
    .first()
})
</script>

<template>
<div min-h-screen min-w-0 flex="~ col" py-10>
  <section class="prose prose-truegray dark:prose-invert max-w-full! text-justify pt-20" >
    <div class="mb-20">
      <h1 class="mb-0! text-black dark:text-white">{{ blog?.title }}</h1>
      <div class="mt-5 text-gray-600 dark:text-gray-500" flex="~ items-center gap-4" font-mono text-xs opacity-50>
        <span>{{ blog?.date ? formatDate(blog.date) : '' }}</span>
        <span>{{ blog?.duration }}</span>
      </div>
    </div>

    <ContentRenderer v-if="blog" :value="blog" />
  </section>
</div>
</template>