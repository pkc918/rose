// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@unocss/nuxt',
  ],
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true }
  },
  css: ['~/assets/css/main.css'],
  mdc: {
    highlight: {
      langs: ['diff', 'ts', 'vue', 'css']
    },
  },
  vite: {
  },
})
