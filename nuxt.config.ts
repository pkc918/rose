// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
  ],
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true }
  },
  css: ['~/assets/css/main.css'],
  content: {
    experimental: { sqliteConnector: 'native' },
  },
  mdc: {
    highlight: {
      langs: ['diff', 'ts', 'vue', 'css']
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },
  vite: {
  },
})
