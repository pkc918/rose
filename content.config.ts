import { defineCollection, defineContentConfig } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

const articleSchema = z.object({
  image: z.string().optional(),
  date: z.date().optional(),
  updatedAt: z.date().optional(),
  lang: z.string().default('zh-CN'),
  duration: z.string().optional(),
  sitemap: defineSitemapSchema({ z }),
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.md',
    }),
    blogs: defineCollection({
      type: 'page',
      source: 'blogs/*.md',
      schema: articleSchema,
    }),
    diaries: defineCollection({
      type: 'page',
      source: 'diaries/*.md',
      schema: articleSchema,
    }),
  },
})
