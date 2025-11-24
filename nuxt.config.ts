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
    '/': { prerender: true },
  },
  css: ['~/assets/css/main.css'],
  content: {
    experimental: { sqliteConnector: 'native' },
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
  hooks: {
    'build:before': async function () {
      const { readdir, writeFile, stat } = await import('node:fs/promises')
      const { join } = await import('node:path')

      const photosDir = join(process.cwd(), 'public', 'photos')
      const outputFile = join(process.cwd(), 'public', 'photos.json')

      console.log('[Photos Build] Generating photos manifest...')

      try {
        // Check if directory exists
        try {
          await stat(photosDir)
        }
        catch {
          console.log('[Photos Build] Photos directory not found, creating empty manifest')
          await writeFile(outputFile, JSON.stringify({ success: true, data: [] }))
          return
        }

        // Read all month folders
        const folders = await readdir(photosDir, { withFileTypes: true })

        // Filter and sort folders
        const monthFolders = folders
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .filter(name => /^\d{4}-\d{2}$/.test(name))
          .sort((a, b) => b.localeCompare(a))

        // Read images from each folder
        const photosByMonth = await Promise.all(
          monthFolders.map(async (folder) => {
            const folderPath = join(photosDir, folder)
            const files = await readdir(folderPath)

            const images = files
              .filter(file => /\.(?:jpg|jpeg|png|gif|webp)$/i.test(file))
              .map(file => ({
                name: file,
                url: `/photos/${folder}/${file}`,
                month: folder,
              }))

            return {
              month: folder,
              images,
            }
          }),
        )

        const result = photosByMonth.filter(month => month.images.length > 0)

        await writeFile(outputFile, JSON.stringify({ success: true, data: result }, null, 2))
        console.log('[Photos Build] Manifest generated successfully')
      }
      catch (error) {
        console.error('[Photos Build] Error generating manifest:', error)
        // Write empty manifest on error to prevent 404s
        await writeFile(outputFile, JSON.stringify({ success: false, error: String(error), data: [] }))
      }
    },
  },
})
