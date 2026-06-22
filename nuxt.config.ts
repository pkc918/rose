// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
  ],
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true },
  },
  site: {
    url: process.env.NUXT_SITE_URL,
    name: '青椒肉丝(Rose)',
    description: 'Rose\'s Blog',
    defaultLocale: 'zh-CN',
  },
  css: ['~/assets/css/main.css'],
  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        toc: { depth: 3 },
      },
    },
  },
  mdc: {
    highlight: {
      langs: ['diff', 'ts', 'vue', 'css'],
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  vite: {
  },
})
