<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
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
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <div min-h-screen grid="~ cols-12 auto-flow-col">
      <div flex="~ col justify-center items-center" class="h-[100vh] sticky top-0 z-10">
        <NavBar />
      </div>
      <section grid="~ col-start-2 col-span-9 cols-[1fr_minmax(0,50rem)_1fr]" min-w-0>
        <div grid="~ col-start-2" px-6 min-w-0>
          <NuxtPage />
        </div>
      </section>
      <div grid="~ col-span-2">
        Projects
      </div>
    </div>
  </UApp>
</template>