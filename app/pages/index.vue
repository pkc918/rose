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
<div w-80vw max-w-80vw min-w-300 min-h-screen flex="~ items-center justify-center">
    <div w-full h-full flex="~ justify-between">
        <div class="w-1/2">
            <h1>Hello World</h1>
        </div>
        <div class="w-1/2">
            <h1>Hello World</h1>
        </div>
    </div>
</div>
</template>