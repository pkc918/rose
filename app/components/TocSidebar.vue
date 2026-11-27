<script setup lang="ts">
interface TocLink {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

const props = defineProps<{
  links: TocLink[]
  article: HTMLElement | null
}>()

const activeIndex = ref<number | null>(null)
const flatLinks = computed(() => {
  function flatten(links: TocLink[]): TocLink[] {
    return links.flatMap(link => [link, ...flatten(link.children || [])])
  }

  return flatten(props.links)
})

function getHeadingElements(): (HTMLElement | null)[] {
  const headings = props.article?.querySelectorAll<HTMLElement>('h2[id], h3[id]') || []
  const headingsById = new Map(Array.from(headings, heading => [heading.id, heading]))
  return flatLinks.value.map(link => headingsById.get(link.id) || null)
}

watchPostEffect((onCleanup) => {
  if (!import.meta.client || !props.article)
    return

  const headingEls = getHeadingElements()
  activeIndex.value = null

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = headingEls.indexOf(entry.target as HTMLElement)
          if (idx !== -1) {
            activeIndex.value = idx
          }
          break
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  )

  for (const el of headingEls) {
    if (el) {
      observer.observe(el)
    }
  }

  onCleanup(() => observer.disconnect())
})

function scrollTo(index: number) {
  const headingEls = getHeadingElements()
  const el = headingEls[index]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeIndex.value = index
    window.history.replaceState(window.history.state, '', `#${encodeURIComponent(el.id)}`)
  }
}
</script>

<template>
  <aside
    v-if="links.length > 0"
    class="article-toc hidden xl:block w-56 flex-shrink-0"
  >
    <nav class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div text-xs font-semibold mb-3 class="text-gray-400 dark:text-gray-600">
        ON THIS PAGE
      </div>
      <ul flex="~ col" gap-1>
        <li
          v-for="(link, index) in flatLinks"
          :key="link.id"
          :style="{ paddingLeft: `${(link.depth - 2) * 0.75}rem` }"
        >
          <a
            :href="`#${encodeURIComponent(link.id)}`"
            block
            text-xs
            py-1
            transition-colors
            duration-150
            class="border-l-2 pl-3"
            :class="activeIndex === index
              ? 'border-gray-800 dark:border-gray-200 text-black dark:text-white'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'"
            @click.prevent="scrollTo(index)"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>
