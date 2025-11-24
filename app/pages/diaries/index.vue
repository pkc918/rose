<script setup lang="ts">
const { data: diaries } = await useAsyncData('xxx', () => queryCollection('diaries' as any).all())

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
  <div min-h-screen flex="~ col" py-6 sm:py-8 md:py-10 pt-6 md:pt-20>
    <div flex="~ col" gap-3 max-w-4xl w-full>
      <NuxtLink
        v-for="(diary, index) in diaries"
        :key="diary.title"
        :to="diary.path"
        flex="~ items-center justify-between sm:justify-start gap-2"
        py-2
        border-b border-transparent
        hover:border-gray-300
        dark:hover:border-gray-700
        transition-all
        group
        class="diary-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div flex="~ items-center gap-2 sm:gap-3" class="flex-1 min-w-0">
          <span
            v-if="diary.lang && diary.lang !== 'zh-CN'"
            text-xs
            opacity-50
            class="lang-tag text-gray-600 dark:text-gray-500 flex-shrink-0"
          >
            {{ getLangLabel(diary.lang) }}
          </span>
          <span
            text-base sm:text-lg
            class="text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 truncate sm:overflow-visible"
            transition-colors
          >
            {{ diary.title }}
          </span>
        </div>

        <div flex="~ items-center gap-2" text-xs sm:text-sm opacity-50 ws-nowrap class="text-gray-600 dark:text-gray-500 flex-shrink-0">
          <span v-if="diary.date">{{ formatDate(diary.date) }}</span>
          <span v-if="diary.date && diary.duration">·</span>
          <span v-if="diary.duration">{{ diary.duration }}</span>
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

.diary-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
