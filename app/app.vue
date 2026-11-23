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

useServerSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogSiteName: title,
  ogType: 'website',
  ogImage: '/avatar.jpeg',
  twitterImage: '/avatar.jpeg',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="font-['DM_Mono','monospace'] bg-white dark:bg-black text-black dark:text-white">
    <!-- 移动端布局 -->
    <div class="md:hidden min-h-screen">
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
    <div class="desktop-layout hidden md:grid min-h-screen mx-auto">
      <div flex="~ col justify-center items-center" class="h-[100vh] sticky top-0 z-10 bg-white dark:bg-black">
        <NavBar />
      </div>
      <section min-w-0>
        <NuxtPage />
      </section>
    </div>
  </div>
</template>

<style scoped>
.desktop-layout {
  --content-width: 50rem;
  --menu-width: 3.5rem;
  --menu-gap: 3rem;
  --page-padding: 1.5rem;

  grid-template-columns: var(--menu-width) minmax(0, 1fr);
  gap: var(--menu-gap);
  padding-inline: var(--page-padding);
  max-width: calc(var(--content-width) + var(--menu-width) + var(--menu-gap) + var(--page-padding) * 2);
}

@media (min-width: 1024px) {
  .desktop-layout {
    --menu-width: 4rem;
    --menu-gap: 5rem;
    --page-padding: 2rem;
  }
}

@media (min-width: 1280px) {
  /* The article directory gets its own space outside the reading width. */
  .desktop-layout:has(.article-toc) {
    max-width: calc(var(--content-width) + var(--menu-width) + var(--menu-gap) + var(--page-padding) * 2 + 14rem + 3rem);
  }
}
</style>
