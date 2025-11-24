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
  <div min-h-screen min-w-0 flex="~ col" py-6 sm:py-8 md:py-10>
    <section class="prose prose-truegray dark:prose-invert max-w-full! text-justify pt-6 sm:pt-10 md:pt-20 content-section">
      <div class="mb-10 sm:mb-16 md:mb-20 blog-header">
        <h1 class="mb-0! text-black dark:text-white">
          {{ blog?.title }}
        </h1>
        <div class="mt-4 sm:mt-5 text-gray-600 dark:text-gray-500" flex="~ items-center gap-3 sm:gap-4" font-mono text-xs opacity-50>
          <span>{{ blog?.date ? formatDate(blog.date) : '' }}</span>
          <span>{{ blog?.duration }}</span>
        </div>
      </div>

      <ContentRenderer v-if="blog" :value="blog" />
    </section>
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

.blog-header {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.content-section :deep(> *:not(.blog-header)) {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.content-section :deep(> *:nth-child(2)) { animation-delay: 0.1s; }
.content-section :deep(> *:nth-child(3)) { animation-delay: 0.2s; }
.content-section :deep(> *:nth-child(4)) { animation-delay: 0.3s; }
.content-section :deep(> *:nth-child(5)) { animation-delay: 0.4s; }
.content-section :deep(> *:nth-child(6)) { animation-delay: 0.5s; }
.content-section :deep(> *:nth-child(7)) { animation-delay: 0.6s; }
.content-section :deep(> *:nth-child(8)) { animation-delay: 0.7s; }
.content-section :deep(> *:nth-child(9)) { animation-delay: 0.8s; }
.content-section :deep(> *:nth-child(10)) { animation-delay: 0.9s; }
.content-section :deep(> *:nth-child(11)) { animation-delay: 1s; }
.content-section :deep(> *:nth-child(12)) { animation-delay: 1.1s; }
.content-section :deep(> *:nth-child(13)) { animation-delay: 1.2s; }
.content-section :deep(> *:nth-child(14)) { animation-delay: 1.3s; }
.content-section :deep(> *:nth-child(15)) { animation-delay: 1.4s; }
.content-section :deep(> *:nth-child(16)) { animation-delay: 1.5s; }
.content-section :deep(> *:nth-child(17)) { animation-delay: 1.6s; }
.content-section :deep(> *:nth-child(18)) { animation-delay: 1.7s; }
.content-section :deep(> *:nth-child(19)) { animation-delay: 1.8s; }
.content-section :deep(> *:nth-child(20)) { animation-delay: 1.9s; }
</style>
