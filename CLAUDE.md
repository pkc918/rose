# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm generate     # Static generation
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
```

## Architecture

This is a personal blog/portfolio site built with **Nuxt 4** and **UnoCSS** (attributify mode). Content is stored as markdown files, not in a database.

### Content layer

- `content/blogs/*.md` and `content/diaries/*.md` — markdown posts with frontmatter (`title`, `date`, `lang`, `duration`). `lang` defaults to `zh-CN`.
- `content/index.md` — the homepage content.
- Collections are defined in `content.config.ts` using Zod schemas. Content is queried via `queryCollection('blogs' as any)` in pages — the `as any` cast is needed because of how the Nuxt Content module resolves types at build time.
- The content module uses the native SQLite connector (`content.experimental.sqliteConnector: 'native'` in nuxt.config.ts).

### Routing

Pages follow Nuxt file-based routing under `app/pages/`. Static routes (`/`, `/photos`, `/resume`) and dynamic routes (`/blogs/[title]`, `/diaries/[title]`) use the slug from the markdown filename. Navigation links in NavBar use hardcoded paths.

### Styling

UnoCSS with attributify mode — classes like `flex="~ col"` instead of `class="flex flex-col"`. The shortcut `fcc` maps to `flex justify-center items-center`. Icons use the `i-tabler-*` prefix from `@iconify-json/tabler`. Dark mode is handled via `dark:` variants (class-based, suffix `''`).

### Photos

A build hook in `nuxt.config.ts` scans `public/photos/{YYYY-MM}/` directories and generates `public/photos.json`. The photos page fetches this JSON at runtime. To add photos, place image files in `public/photos/{YYYY-MM}/`.

### Layout

Mobile (< `md`): bottom fixed nav bar. Desktop: sticky left sidebar nav with a 12-column CSS grid. Both defined together in `app.vue`. The `layouts/default.vue` only injects Vercel Speed Insights.

### ESLint

Uses `@antfu/eslint-config` with TypeScript and Vue presets. Console statements are allowed (`no-console: off`). The `content/` directory is ignored.
