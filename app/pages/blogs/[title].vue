<script setup lang="ts">
const route = useRoute()

// 获取具体的博客内容
const { data: blog } = await useAsyncData(route.path, () => {
  return queryCollection('blogs' as any)
    .path(route.path)
    .first()
})
</script>

<template>
<div min-h-screen flex="~ col" py-10>
  <section class="prose prose-truegray dark:prose-invert max-w-none" text-justify pt-20>
    <h1>{{ blog.title }}</h1>
    <div>
      <span>{{ blog.lang }}</span>
      <span>{{ blog.date }}</span>
      <span>{{ blog.duration }}</span>
    </div>
    <ContentRenderer v-if="blog" :value="blog" />
      <!-- <ContentRenderer v-if="blog" :value="blog">
        <template #toc="{ value }">123</template>
      </ContentRenderer> -->
    </section>
</div>
</template>