<script setup lang="ts">
const { data: blogs } = await useAsyncData('blogs', () => queryCollection('blogs' as any).all())

// 格式化日期为 "Apr 28" 格式
function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}

// 获取语言标签显示文本
function getLangLabel(lang: string) {
  const langMap: Record<string, string> = {
    'zh-CN': '中文',
    'en': 'English',
    'ja': '日本語'
  }
  return langMap[lang] || ''
}
</script>

<template>
<div min-h-screen flex="~ col" py-10 pt-40>
  <div flex="~ col" gap-3 max-w-4xl>
    <NuxtLink
      v-for="blog in blogs"
      :key="blog._id"
      :to="`/blogs/${blog._id}`"
      flex="~ items-center justify-start gap-2"
      py-2
      border-b border-transparent
      hover:border-gray-200
      dark:hover:border-gray-800
      transition-all
      group
    >
      <div flex="~ items-center gap-3">
        <span
          v-if="blog.lang && blog.lang !== 'zh-CN'"
          text-xs
          opacity-50
          class="lang-tag"
        >
          {{ getLangLabel(blog.lang) }}
        </span>
        <span 
          text-lg
          group-hover:text-primary
          transition-colors
        >
          {{ blog.title }}
        </span>
      </div>
      
      <div flex="~ items-center gap-2" text-sm opacity-50 ws-nowrap>
        <span v-if="blog.date">{{ formatDate(blog.date) }}</span>
        <span v-if="blog.date && blog.duration">·</span>
        <span v-if="blog.duration">{{ blog.duration }}</span>
      </div>
    </NuxtLink>
  </div>
</div>
</template>