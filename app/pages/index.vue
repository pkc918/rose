<script setup lang="ts">
const appConfig = useAppConfig()

const { data: versions } = await useFetch(computed(() => `https://ungh.cc/repos/${appConfig.repository}/releases`), {
  transform: (data: {
    releases: {
      name?: string
      tag: string
      publishedAt: string
      markdown: string
    }[]
  }) => {
    return data.releases.map(release => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt,
      markdown: release.markdown
    }))
  }
})
</script>

<template>
<div min-h-screen grid="~ auto cols-6 ">
    <div py-4 pt-20 col-span-2>
      <div w-full>
        <h1 class="my-8">青椒肉丝🫑</h1>
        <article>
          <p>一个相当大佬的小白.</p>
          <p>学无止境！</p>
        </article>
        <div>
          描述xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </div>
      </div>
      <div>
        活跃日历
      </div>
    </div>
</div>
</template>