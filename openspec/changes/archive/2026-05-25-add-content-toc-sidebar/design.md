## Context

Blog and diary detail pages (`blogs/[title].vue`, `diaries/[title].vue`) are near-duplicates — same layout, same `ContentRenderer` usage, same fade-in animations. They differ only in the collection name (`'blogs'` vs `'diaries'`).

Nuxt Content v3 provides built-in TOC data via `content.toc.links` when configured with `content.build.markdown.toc.depth`. Each link has `{ id: string, depth: number, text: string }`.

The desktop layout in `app.vue` uses a 12-column grid. The content area sub-grid (`cols-[1fr_minmax(0,50rem)_1fr]`) has empty space on the right — but putting TOC in `app.vue` would require passing data from `<NuxtPage />` up to the layout.

## Goals / Non-Goals

**Goals:**
- Display a sticky TOC sidebar next to blog/diary content on desktop
- Highlight the currently visible heading based on scroll position
- Click a heading to smoothly scroll to it, updating the URL hash
- Extract the shared content layout into a single `ContentPage.vue` component

**Non-Goals:**
- TOC on mobile (hidden, no space)
- Collapsible/expandable TOC sections
- Progress bar or scroll-position indicator
- Floating TOC button (mobile alternative)
- TOC for the photos or resume pages

## Decisions

### TOC data source: `page.toc.links`

Nuxt Content v3's `body.toc` provides a `links` array with heading `id`, `depth`, and `text`. Configure `content.build.markdown.toc.depth: 3` to include h2 and h3.

**Alternatives considered:**
- **DOM-based extraction**: `document.querySelectorAll('h2, h3')` in `onMounted`. Simpler but client-only, brief flash before TOC appears. Rejected in favor of server-rendered data.
- **Body AST traversal**: Reliable and server-side, but `toc.links` is already built from the AST — no point redoing it.

### Component architecture: shared ContentPage

Extract the duplicate layout (article header + ContentRenderer + fade-in CSS) from both `[title].vue` pages into a single `ContentPage.vue`. This eliminates duplication and ensures TOC appears on both blog and diary pages.

The `[title].vue` pages become thin wrappers:
```vue
<ContentPage collection="blogs" />
```

**Alternative considered:** Keep pages as-is and add TOC separately to each. Rejected — the two pages are 95% identical and would drift further with independent TOC changes.

### Scroll tracking: IntersectionObserver

Use `IntersectionObserver` on rendered heading elements to determine the current reading position. The first visible heading (or topmost when multiple are visible) is highlighted in TOC.

**Alternative considered:** Scroll event + `getBoundingClientRect()`. More work, less efficient, no benefit over IntersectionObserver.

### URL hash sync: `history.replaceState`

On click, update the URL hash with `history.replaceState(null, '', '#heading-id')` to avoid adding a history entry for every TOC click. The hash also makes headings shareable.

## Risks / Trade-offs

- **TOC may be empty for short articles**: If an article has no h2/h3 headings, `toc.links` is empty and TocSidebar renders nothing. Handled with a `v-if` guard.
- **Heading IDs must match**: The TOC `id` from Nuxt Content must match the `id` attribute that ContentRenderer generates. Since both come from the same MDC pipeline, they are guaranteed to match. If custom heading components are added later, this invariant must be preserved.
