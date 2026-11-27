<script setup lang="ts">
const props = defineProps<{
  collection: 'blogs' | 'diaries'
}>()

const path = useRoute().path
const article = ref<HTMLElement | null>(null)

const { data, error } = await useAsyncData(`article:${path}`, () => {
  return queryCollection(props.collection).path(path).first()
})
if (error.value)
  throw createError({ ...error.value, fatal: true })
if (!data.value)
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: import.meta.client })

const page = data.value
const { title, description, date, updatedAt, lang, image } = page
const author = { name: '青椒肉丝', url: 'https://github.com/pkc918' }
const dateFormatter = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' })
const locale = new Intl.Locale(lang).maximize()

useHead({ htmlAttrs: { lang, tagPriority: 'low' } })
useSeoMeta({
  title,
  description,
  author: author.name,
  ogTitle: title,
  ogDescription: description,
  ogImage: image || '/avatar.jpeg',
  ogType: 'article',
  ogLocale: `${locale.language}_${locale.region}`,
  twitterTitle: title,
  twitterDescription: description,
  twitterCard: image ? 'summary_large_image' : 'summary',
  twitterImage: image || '/avatar.jpeg',
  articlePublishedTime: date || undefined,
  articleModifiedTime: updatedAt || undefined,
})

useSchemaOrg([
  defineWebPage({ description, inLanguage: lang }),
  defineArticle({
    '@type': 'BlogPosting',
    'headline': title,
    description,
    'inLanguage': lang,
    'author': definePerson(author),
    'datePublished': date || undefined,
    'dateModified': updatedAt || undefined,
    'image': image || [],
  }),
])

const tocLinks = page.body.toc?.links || []
</script>

<template>
  <div min-h-screen min-w-0 flex="~ col" py-6 sm:py-8 md:py-10 class="pt-0!">
    <div flex="~" gap-8 md:gap-12>
      <article ref="article" min-w-0 flex-1>
        <section class="prose prose-truegray dark:prose-invert max-w-full! text-justify pt-0 content-section">
          <div class="mb-10 sm:mb-16 md:mb-20 blog-header">
            <h1 class="mb-0! text-black dark:text-white">
              {{ title }}
            </h1>
            <div class="mt-4 sm:mt-5 text-gray-600 dark:text-gray-500" flex="~ items-center gap-3 sm:gap-4" font-mono text-xs opacity-50>
              <NuxtLink to="/" rel="author" class="no-underline hover:underline">
                {{ author.name }}
              </NuxtLink>
              <time v-if="date" :datetime="date.slice(0, 10)">{{ dateFormatter.format(new Date(date)) }}</time>
              <span v-if="updatedAt">
                {{ lang.startsWith('zh') ? '更新于' : 'Updated' }}
                <time :datetime="updatedAt.slice(0, 10)">{{ dateFormatter.format(new Date(updatedAt)) }}</time>
              </span>
              <span v-if="page.duration">{{ page.duration }}</span>
            </div>
          </div>

          <ContentRenderer :value="page" />
        </section>
      </article>

      <TocSidebar v-if="tocLinks.length" :links="tocLinks" :article="article" />
    </div>
  </div>
</template>

<style scoped>
.content-section :deep(h2),
.content-section :deep(h3) {
  scroll-margin-top: 6rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-header {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.content-section :deep(> *:not(.blog-header)) {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.content-section :deep(> *:nth-child(2)) { animation-delay: 0.1s; }
.content-section :deep(> *:nth-child(3)) { animation-delay: 0.2s; }
.content-section :deep(> *:nth-child(4)) { animation-delay: 0.3s; }
.content-section :deep(> *:nth-child(5)) { animation-delay: 0.4s; }
.content-section :deep(> *:nth-child(6)) { animation-delay: 0.5s; }
.content-section :deep(> *:nth-child(7)) { animation-delay: 0.6s; }
.content-section :deep(> *:nth-child(8)) { animation-delay: 0.7s; }
.content-section :deep(> *:nth-child(9)) { animation-delay: 0.8s; }
.content-section :deep(> *:nth-child(10)) { animation-delay: 0.9s; }
.content-section :deep(> *:nth-child(11)) { animation-delay: 1s; }
.content-section :deep(> *:nth-child(12)) { animation-delay: 1.1s; }
.content-section :deep(> *:nth-child(13)) { animation-delay: 1.2s; }
.content-section :deep(> *:nth-child(14)) { animation-delay: 1.3s; }
.content-section :deep(> *:nth-child(15)) { animation-delay: 1.4s; }
.content-section :deep(> *:nth-child(16)) { animation-delay: 1.5s; }
.content-section :deep(> *:nth-child(17)) { animation-delay: 1.6s; }
.content-section :deep(> *:nth-child(18)) { animation-delay: 1.7s; }
.content-section :deep(> *:nth-child(19)) { animation-delay: 1.8s; }
.content-section :deep(> *:nth-child(20)) { animation-delay: 1.9s; }
</style>
