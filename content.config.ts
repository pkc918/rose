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
        title: z.string(),
        date: z.date(),
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