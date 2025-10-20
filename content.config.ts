import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.md',
    }),
    blogs: defineCollection({
      type: 'page',
      source: 'blogs/*.md',
      schema: z.object({
        date: z.string().default(() => new Date().toISOString().split('T')[0]),
        lang: z.string().default('zh-CN'),
        duration: z.string().optional(),
      })
    }),
    diaries: defineCollection({
      type: 'page',
      source: 'diary/*.md',
      // schema: z.object({
      //   date: z.string()
      // })
    })
  }
})