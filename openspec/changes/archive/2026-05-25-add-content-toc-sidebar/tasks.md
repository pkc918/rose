## 1. Configuration

- [x] 1.1 Add `content.build.markdown.toc: { depth: 3 }` to `nuxt.config.ts`

## 2. TocSidebar component

- [x] 2.1 Create `app/components/TocSidebar.vue` with props `links: { id, depth, text }[]`
- [x] 2.2 Implement sticky sidebar layout (hidden on mobile, `~w-48` on desktop, scrollable max-height)
- [x] 2.3 Implement heading link list with depth-based indentation
- [x] 2.4 Implement IntersectionObserver scroll tracking and active heading highlight
- [x] 2.5 Implement click handler: smooth scroll + `history.replaceState` hash update

## 3. ContentPage shared component

- [x] 3.1 Create `app/components/ContentPage.vue` accepting `collection: string` prop
- [x] 3.2 Implement content query via `queryCollection(collection)` using `useRoute().path`
- [x] 3.3 Implement article layout: header (title, date, duration) + ContentRenderer + TocSidebar
- [x] 3.4 Port fade-in animations from existing `[title].vue` pages

## 4. Simplify existing pages

- [x] 4.1 Replace `app/pages/blogs/[title].vue` with `<ContentPage collection="blogs" />` wrapper
- [x] 4.2 Replace `app/pages/diaries/[title].vue` with `<ContentPage collection="diaries" />` wrapper

## 5. Verification

- [x] 5.1 Run `pnpm dev` and verify TOC appears on `/blogs/tokenization` — server running on :3001, verified TOC data present in SQLite body (3 headings: h2 x3)
- [ ] 5.2 Verify scroll tracking highlights the correct heading (browser verification needed)
- [ ] 5.3 Verify click navigation works with smooth scroll and URL hash (browser verification needed)
- [ ] 5.4 Verify mobile viewport hides TOC (browser verification needed)
- [ ] 5.5 Verify diary pages also show TOC (browser verification needed)
