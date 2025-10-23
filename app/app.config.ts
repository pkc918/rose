export default defineAppConfig({
  repository: 'nuxt/ui',
  ui: {
    colors: {
      primary: 'green',
      neutral: 'black'
    },
    prose: {
      li: {
        base: 'break-words'
      },
      a: {
        base: 'break-words'
      }
    }
  }
})