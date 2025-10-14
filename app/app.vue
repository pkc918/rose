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

const title = 'Nuxt Changelog Template'
const description = 'Display GitHub release notes as a beautiful changelog for any repository with this Nuxt UI template.'

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
      <NavBar />
      <section grid="~ col-span-8 justify-center">
        <NuxtPage />
      </section>
      <div grid="~ col-start-11 col-span-2">
        广告区
      </div>
    </div>
  </UApp>
</template>