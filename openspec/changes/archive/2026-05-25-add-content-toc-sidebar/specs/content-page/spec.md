## ADDED Requirements

### Requirement: ContentPage renders article from collection

The system SHALL provide a `ContentPage` component that accepts a `collection` prop (string) and renders the markdown article for the current route path. The component SHALL query the specified Nuxt Content collection, display the article title, date, and duration metadata, render the body via `ContentRenderer`, and show the TOC sidebar on desktop.

#### Scenario: Render a blog post

- **WHEN** navigating to `/blogs/what-is-a-token` with `<ContentPage collection="blogs" />`
- **THEN** the page displays the blog post title, date, duration, full body content, and TOC sidebar (desktop)

#### Scenario: Render a diary entry

- **WHEN** navigating to `/diaries/2025-12-02` with `<ContentPage collection="diaries" />`
- **THEN** the page displays the diary entry title, date, duration, full body content, and TOC sidebar (desktop)

#### Scenario: Content not found

- **WHEN** navigating to a path that does not exist in the collection
- **THEN** the component gracefully handles a null/undefined page value without crashing

### Requirement: ContentPage applies fade-in animations

The system SHALL apply staggered fade-in-up animations to article content elements, matching the existing animation behavior from `blogs/[title].vue` and `diaries/[title].vue`.

#### Scenario: Article loads

- **WHEN** a blog post loads
- **THEN** the header fades in first, followed by content children with staggered delays
