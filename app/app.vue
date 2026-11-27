<script setup>
useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
})
</script>

<template>
  <div class="font-['DM_Mono','monospace'] bg-white dark:bg-black text-black dark:text-white">
    <div class="site-layout min-h-screen mx-auto md:grid">
      <div class="fixed bottom-0 inset-x-0 z-50 flex flex-col justify-center items-center bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-3 px-4 md:sticky md:top-0 md:bottom-auto md:z-10 md:h-screen md:border-0 md:p-0">
        <NavBar />
      </div>
      <main class="min-w-0 px-4 pb-20 sm:px-6 md:p-0">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .site-layout {
    --content-width: 50rem;
    --menu-width: 3.5rem;
    --menu-gap: 3rem;
    --page-padding: 1.5rem;

    grid-template-columns: var(--menu-width) minmax(0, 1fr);
    gap: var(--menu-gap);
    padding-inline: var(--page-padding);
    max-width: calc(var(--content-width) + var(--menu-width) + var(--menu-gap) + var(--page-padding) * 2);
  }
}

@media (min-width: 1024px) {
  .site-layout {
    --menu-width: 4rem;
    --menu-gap: 5rem;
    --page-padding: 2rem;
  }
}

@media (min-width: 1280px) {
  /* The article directory gets its own space outside the reading width. */
  .site-layout:has(.article-toc) {
    max-width: calc(var(--content-width) + var(--menu-width) + var(--menu-gap) + var(--page-padding) * 2 + 14rem + 3rem);
  }
}
</style>
