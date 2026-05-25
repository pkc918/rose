<script setup lang="ts">
interface TocLink {
  id: string
  depth: number
  text: string
}

const props = defineProps<{
  links: TocLink[]
}>()

const activeIndex = ref<number | null>(null)

// Build index: which heading DOM element corresponds to each TOC link
function getHeadingElements(): (HTMLElement | null)[] {
  const articleHeadings = document.querySelectorAll('article h2, article h3')
  const headingArr = Array.from(articleHeadings) as HTMLElement[]
  // Match TOC links to rendered headings by position
  return props.links.map((_, i) => headingArr[i] || null)
}

onMounted(async () => {
  await nextTick()
  await nextTick() // double tick ensures ContentRenderer has rendered
  const headingEls = getHeadingElements()

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = headingEls.indexOf(entry.target as HTMLElement)
          if (idx !== -1) activeIndex.value = idx
          break
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  )

  for (const el of headingEls) {
    if (el) observer.observe(el)
  }

  onBeforeUnmount(() => observer.disconnect())
})

function scrollTo(index: number) {
  const headingEls = getHeadingElements()
  const el = headingEls[index]
  if (el) {
    // Ensure heading has an id for URL hash
    if (!el.id) {
      el.id = props.links[index].id
    }
    el.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', `#${el.id}`)
  }
}
</script>

<template>
  <aside
    v-if="links.length > 0"
    class="hidden md:block w-48 lg:w-56 flex-shrink-0"
  >
    <nav class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div text-xs font-semibold mb-3 class="text-gray-400 dark:text-gray-600">
        ON THIS PAGE
      </div>
      <ul flex="~ col" gap-1>
        <li
          v-for="(link, index) in links"
          :key="link.id"
          :style="{ paddingLeft: `${(link.depth - 2) * 0.75}rem` }"
        >
          <a
            :href="`#${link.id}`"
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
