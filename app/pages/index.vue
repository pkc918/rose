<script setup lang="ts">
const { data: indexContent } = await useAsyncData('index', () => queryCollection('index' as any).first())
nextTick(() => {
  console.log('indexContent', indexContent.value)
})
</script>

<template>
<div min-h-screen flex="~ col" class="text-black dark:text-white">
  <div w-full flex="~ col gap-4">
    <section class="prose prose-truegray dark:prose-invert max-w-none" text-justify pt-20>
      <ContentRenderer v-if="indexContent" :value="indexContent" />
    </section>
  </div>
</div>
</template>