<script setup lang="ts">
const { data: indexContent } = await useAsyncData('index', () => queryCollection('index' as any).first())
nextTick(() => {
  console.log('indexContent', indexContent.value)
})
</script>

<template>
<div min-h-screen flex="~ col" class="text-black dark:text-white">
  <div w-full flex="~ col gap-4">
    <section class="prose prose-truegray dark:prose-invert max-w-none content-section" text-justify pt-20>
      <ContentRenderer v-if="indexContent" :value="indexContent" />
    </section>
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

.content-section :deep(> *) {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.content-section :deep(> *:nth-child(1)) { animation-delay: 0s; }
</style>