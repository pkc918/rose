// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_SITE_URL

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
  ],
  devtools: { enabled: true },
  routeRules: {
    '/resume': { robots: false },
  },
  nitro: {
    prerender: siteUrl
      ? { routes: ['/', '/sitemap.xml', '/robots.txt'], crawlLinks: true }
      : {},
  },
  site: {
    url: siteUrl,
    name: '青椒肉丝(Rose)',
    description: '青椒肉丝的个人博客，记录前端开发、Nuxt、TypeScript、AI 工具和工程实践。',
    defaultLocale: 'zh-CN',
  },
  seo: {
    canonicalQueryWhitelist: [],
    canonicalLowercase: false,
  },
  schemaOrg: {
    reactive: true,
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
