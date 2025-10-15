import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string()
      })
    }),
    diary: defineCollection({
      type: 'page',
      source: 'diary/*.md',
      // schema: z.object({
      //   date: z.string()
      // })
    })
  }
})