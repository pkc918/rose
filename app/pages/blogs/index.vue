<script setup lang="ts">
const { data: blogs } = await useAsyncData('xxx', () => queryCollection('blogs' as any).all())

// 获取语言标签显示文本
function getLangLabel(lang: string) {
  const langMap: Record<string, string> = {
    'zh-CN': '中文',
    'en': 'English',
    'ja': '日本語',
  }
  return langMap[lang] || ''
}
</script>

<template>
  <div min-h-screen flex="~ col" py-6 sm:py-8 md:py-10 pt-6 md:pt-40>
    <h1 class="text-5xl font-bold mb-10">
      Blogs
    </h1>
    <div flex="~ col" gap-3 max-w-4xl w-full>
      <NuxtLink
        v-for="(blog, index) in blogs"
        :key="blog.title"
        :to="blog.path"
        flex="~ items-center justify-between sm:justify-start gap-2"
        py-2
        border-b border-transparent
        hover:border-gray-300
        dark:hover:border-gray-700
        transition-all
        group
        class="blog-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div flex="~ items-center gap-2 sm:gap-3" class="flex-1 min-w-0">
          <span
            v-if="blog.lang && blog.lang !== 'zh-CN'"
            text-xs
            opacity-50
            class="lang-tag text-gray-600 dark:text-gray-500 flex-shrink-0"
          >
            {{ getLangLabel(blog.lang) }}
          </span>
          <span
            text-base md:text-lg
            class="text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 truncate md:overflow-visible"
            transition-colors
          >
            {{ blog.title }}
          </span>
        </div>

        <div flex="~ items-center gap-2" text-xs md:text-sm opacity-50 ws-nowrap class="text-gray-600 dark:text-gray-500 flex-shrink-0">
          <span v-if="blog.date">{{ formatDate(blog.date) }}</span>
          <span v-if="blog.date && blog.duration">·</span>
          <span v-if="blog.duration">{{ blog.duration }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
