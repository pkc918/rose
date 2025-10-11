// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxt/ui',
    '@nuxtjs/mdc',
  ],
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true }
  },
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      defaultVariants: {
        color: 'neutral'
      }
    }
  },
  mdc: {
    highlight: {
      langs: ['diff', 'ts', 'vue', 'css']
    },
    remarkPlugins: {
      'remark-github': {
        options: {
          repository: 'nuxt-ui-templates/changelog'
        }
      }
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
