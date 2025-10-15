<script setup lang="ts">
// const appConfig = useAppConfig()

// const { data: versions } = await useFetch(computed(() => `https://ungh.cc/repos/${appConfig.repository}/releases`), {
//   transform: (data: {
//     releases: {
//       name?: string
//       tag: string
//       publishedAt: string
//       markdown: string
//     }[]
//   }) => {
//     return data.releases.map(release => ({
//       tag: release.tag,
//       title: release.name || release.tag,
//       date: release.publishedAt,
//       markdown: release.markdown
//     }))
//   }
// })

const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())

nextTick(() => {
  console.log('posts',posts.value)
})
</script>

<template>
<div min-h-screen grid="~ auto cols-6 ">
  <div>
    <h1>Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post }}
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</div>
</template>