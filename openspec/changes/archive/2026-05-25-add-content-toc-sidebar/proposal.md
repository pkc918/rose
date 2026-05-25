## Why

Blog and diary pages render markdown content without any heading navigation. For longer articles with multiple sections, readers can't quickly jump to a specific section or see an overview of the article structure. This is a basic UX expectation for any content site.

## What Changes

- Enable Nuxt Content's built-in TOC generation via config (`content.build.markdown.toc.depth: 3`)
- Create a `TocSidebar.vue` component that renders a sticky sidebar with heading links, current-position highlighting, and smooth-scroll navigation
- Create a `ContentPage.vue` shared component that combines article layout + TOC sidebar, replacing the near-duplicate code in blog and diary detail pages
- Simplify `blogs/[title].vue` and `diaries/[title].vue` to delegate to `ContentPage`

## Capabilities

### New Capabilities

- `content-toc`: Sticky table of contents sidebar that extracts headings (h2/h3) from Nuxt Content markdown, highlights the current reading position via IntersectionObserver, and supports smooth-scroll navigation with URL hash sync.
- `content-page`: Shared page component for rendering Nuxt Content markdown articles with a consistent layout (article body + optional TOC sidebar).

### Modified Capabilities

<!-- None - all new capabilities -->

## Impact

- `nuxt.config.ts` — add `content.build.markdown.toc` config
- New: `app/components/TocSidebar.vue`
- New: `app/components/ContentPage.vue`
- Modified: `app/pages/blogs/[title].vue` — replaced with ContentPage
- Modified: `app/pages/diaries/[title].vue` — replaced with ContentPage
