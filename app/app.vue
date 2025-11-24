<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = '青椒肉丝(Rose)'
const description = 'Rose\'s Blog'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp class="font-['DM_Mono','monospace'] bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
    <!-- 移动端布局 -->
    <div class="block md:hidden min-h-screen">
      <div class="pb-20">
        <div px-4 sm:px-6>
          <NuxtPage />
        </div>
      </div>
      <!-- 移动端底部导航栏 -->
      <div
        fixed
        bottom-0
        left-0
        right-0
        z-50
        flex="~ justify-center items-center"
        class="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
        py-3
        px-4
      >
        <NavBar />
      </div>
    </div>

    <!-- 桌面端布局 -->
    <div class="hidden md:block min-h-screen grid grid-cols-12 auto-flow-col">
      <div flex="~ col justify-center items-center" class="h-[100vh] sticky top-0 z-10 bg-white dark:bg-black">
        <NavBar />
      </div>
      <section grid="~ col-start-2 col-span-9 cols-[1fr_minmax(0,50rem)_1fr]" min-w-0>
        <div grid="~ col-start-2" px-6 min-w-0>
          <NuxtPage />
        </div>
      </section>
      <div grid="~ col-span-2" class="text-gray-600 dark:text-gray-500">
        <!-- Projects -->
      </div>
    </div>
  </UApp>
</template>
