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
<div min-h-screen flex="~ col">
  <div w-full flex="~ col gap-4">
    <section text-justify pt-20>
      <h1 my-10>青椒肉丝</h1>
      <p>👋 Hey there! I’m a front-end developer based in Hangzhou, running on caffeine and code.
      I love writing TypeScript, JavaScript, and Go — different languages, same passion.
      Every line I write feels like building a tiny universe of my own.</p>
      <p>I enjoy turning ideas into code —
      from random little tools to projects that might just change the world.
      If it can be coded, I’ll probably try it.</p>
      <p>After work, my life switches from frontend to front-running —
      I debug my thoughts while running,
      tune my mood while playing guitar,
      capture life’s bugs through my camera,
      and edit time itself while cutting videos.</p>
      <p>My idol is antfu,
      and my goal is to write code that’s just as elegant, reusable,
      and makes people say, “Wait… you can actually do that?”</p>
      <p>If you’re in Hangzhou too,
      let’s grab a coffee sometime —
      we can talk about code, creativity,
      or the next commit that might change the world.</p>
    </section>
    <GithubContributionGraph />
    <!-- <h1>Blog</h1> -->
    <!-- <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post }}
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </li>
    </ul> -->
  </div>
</div>
</template>